const Exam = {
  exams: [],

  load() {
    this.exams = Storage.getExams();
  },

  save() {
    Storage.setExams(this.exams);
  },

  addExam(subject, examDate) {
    this.exams.push({
      id: Date.now(),
      subject: subject,
      examDate: examDate,
      tasks: [],
    });
    this.exams.sort((a, b) => new Date(a.examDate) - new Date(b.examDate));
    this.save();
  },

  removeExam(id) {
    this.exams = this.exams.filter(e => e.id !== id);
    this.save();
  },

  addTask(examId, text) {
    const exam = this.exams.find(e => e.id === examId);
    if (exam) {
      exam.tasks.push({ id: Date.now(), text, done: false });
      this.save();
    }
  },

  toggleTask(examId, taskId) {
    const exam = this.exams.find(e => e.id === examId);
    if (exam) {
      const task = exam.tasks.find(t => t.id === taskId);
      if (task) { task.done = !task.done; this.save(); }
    }
  },

  removeTask(examId, taskId) {
    const exam = this.exams.find(e => e.id === examId);
    if (exam) {
      exam.tasks = exam.tasks.filter(t => t.id !== taskId);
      this.save();
    }
  },

  getClass(daysLeft) {
    if (daysLeft < 7) return 'exam-urgent';
    if (daysLeft <= 30) return 'exam-mid';
    return 'exam-safe';
  },

  getLabel(daysLeft) {
    if (daysLeft < 0) return '已结束';
    if (daysLeft === 0) return '今天考试！';
    if (daysLeft === 1) return '明天考试！';
    return `还有 ${daysLeft} 天`;
  },

  render(el) {
    this.load();
    if (this.exams.length === 0) {
      el.innerHTML = '<div style="text-align:center;color:var(--text-sub);padding:10px 0;font-size:0.85rem;">还没有添加考试~</div>';
      return;
    }

    const today = new Date(); today.setHours(0, 0, 0, 0);

    el.innerHTML = this.exams.map(e => {
      const examDate = new Date(e.examDate); examDate.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((examDate - today) / 86400000);
      const cls = this.getClass(daysLeft);
      const done = e.tasks.filter(t => t.done).length;
      const total = e.tasks.length;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;

      const tasksHTML = e.tasks.length > 0
        ? e.tasks.map(t => `
          <div class="task-row">
            <input type="checkbox" data-exam="${e.id}" data-task="${t.id}" ${t.done ? 'checked' : ''}>
            <span class="${t.done ? 'task-done' : ''}">${t.text}</span>
            <button data-del-task="${e.id}" data-task="${t.id}" style="margin-left:auto;background:none;border:none;font-size:0.7rem;cursor:pointer;opacity:0.4;">✕</button>
          </div>`).join('')
        : '<div style="font-size:0.78rem;color:var(--text-sub);padding:4px 0;">暂无复习任务，在设置里添加~</div>';

      return `
        <div class="exam-item ${cls}" data-exam="${e.id}">
          <div class="exam-header">
            <span class="exam-subject">${e.subject}</span>
            <span class="exam-countdown">${this.getLabel(daysLeft)}</span>
          </div>
          ${total > 0 ? `<div class="exam-progress"><div class="exam-progress-bar" style="width:${pct}%;"></div></div>
          <div style="font-size:0.72rem;color:var(--text-sub);margin-top:2px;">${done}/${total} 已完成</div>` : ''}
          <div class="exam-tasks">${tasksHTML}</div>
        </div>`;
    }).join('');

    // Bind checkbox clicks
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        this.toggleTask(parseInt(cb.dataset.exam), parseInt(cb.dataset.task));
        this.render(el);
      });
    });

    // Bind delete task buttons
    el.querySelectorAll('[data-del-task]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.removeTask(parseInt(btn.dataset.delTask), parseInt(btn.dataset.task));
        this.render(el);
      });
    });

    // Bind exam item click to toggle tasks
    el.querySelectorAll('.exam-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('open');
      });
    });
  },

  renderSettingsForm(formEl) {
    this.load();
    formEl.innerHTML = `
      <div class="settings-section">
        <h3>📝 考试管理</h3>
        <div class="settings-row">
          <input id="exam-subject" placeholder="考试科目" style="flex:2">
          <input id="exam-date" type="date" style="flex:1.5">
          <button id="add-exam-btn">添加</button>
        </div>
        <div id="exam-list" style="margin-top:10px;"></div>
      </div>
    `;
    this.renderExamList(document.getElementById('exam-list'));

    document.getElementById('add-exam-btn').addEventListener('click', () => {
      const subject = document.getElementById('exam-subject').value.trim();
      const date = document.getElementById('exam-date').value;
      if (!subject || !date) return;
      this.addExam(subject, date);
      this.renderExamList(document.getElementById('exam-list'));
      document.getElementById('exam-subject').value = '';
      document.getElementById('exam-date').value = '';
    });
  },

  renderExamList(el) {
    this.load();
    if (this.exams.length === 0) {
      el.innerHTML = '<div style="color:var(--text-sub);font-size:0.85rem;">还没有添加考试~</div>';
      return;
    }
    el.innerHTML = this.exams.map(e => `
      <div style="padding:8px 0;border-bottom:1px solid #f0ebe0;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.85rem;font-weight:600;">${e.subject}</span>
          <span style="font-size:0.78rem;color:var(--text-sub);">${e.examDate}</span>
          <button onclick="Exam.removeExam(${e.id});Exam.renderExamList(document.getElementById('exam-list'))" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:0.8rem;">删除</button>
        </div>
        <div style="margin-top:4px;">
          ${e.tasks.map(t => `<span style="font-size:0.75rem;color:var(--text-sub);margin-right:8px;">${t.done ? '✅' : '⬜'} ${t.text}</span>`).join('')}
        </div>
        <div class="settings-row" style="margin-top:4px;">
          <input id="task-input-${e.id}" placeholder="添加复习任务" style="flex:2;font-size:0.8rem;">
          <button onclick="Exam.addTask(${e.id},document.getElementById('task-input-${e.id}').value.trim());if(!document.getElementById('task-input-${e.id}').value.trim())return;Exam.renderExamList(document.getElementById('exam-list'))" style="font-size:0.75rem;padding:6px 10px;">+</button>
        </div>
      </div>
    `).join('');
  },
};
