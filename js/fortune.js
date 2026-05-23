const Fortune = {
  // ═══════════════════════════════════════════════════════════════
  //  中华道教灵签 — 二十八签（应二十八宿）
  // ═══════════════════════════════════════════════════════════════

  _levelWeights: {
    '上上签': 2,
    '上吉签': 6,
    '中签':   12,
    '下签':   8,
  },

  sticks: [
    // ═══ 上上签 (2支) ═══
    {
      id: 1, level: '上上签',
      poem: '龙腾云海日光华，万里鹏程路不赊。\n自有贵人相引助，春风得意马蹄花。',
      allusion: '「鲤鱼跃龙门」—— 大禹治水时，江海之鱼逆流而上，跃过龙门者化身为龙。',
      oracle: {
        overall: '大吉大利之兆！如龙腾云海，势不可挡。近期运势极旺，诸事顺遂。',
        career:   '学业事业如日中天，贵人相助，关键机遇将至。考试求职皆宜，大胆前行，必有所成。',
        love:     '桃花旺盛，良缘可期。已有伴侣者感情升温，单身者有望遇见心仪之人。',
        health:   '身心俱佳，精力充沛。宜趁此时调理养生，效果事半功倍。',
      }
    },
    {
      id: 2, level: '上上签',
      poem: '月满西楼桂子香，金风玉露润华堂。\n心中所求皆如意，福寿康宁百事昌。',
      allusion: '「嫦娥奔月」—— 后羿之妻嫦娥服不死之药，飞升月宫，终得长生圆满。',
      oracle: {
        overall: '圆满如意之兆！如中秋满月，光明澄澈。所愿之事皆有望达成，福泽深厚。',
        career:   '学业事业将迎来丰收期。之前的努力开始结果，收获认可与回报。',
        love:     '缘分已熟，如金风玉露相逢。感情甜蜜稳定，宜定终身之约。',
        health:   '身体康健，心态平和。保持现有良好习惯即可，无大病之忧。',
      }
    },

    // ═══ 上吉签 (6支) ═══
    {
      id: 3, level: '上吉签',
      poem: '春风吹绿上林枝，燕子衔泥归未迟。\n莫道今年花事晚，满园桃李正当时。',
      allusion: '「苏秦刺股」—— 战国苏秦游说列国，屡遭挫折，归家刺股苦读，终佩六国相印。',
      oracle: {
        overall: '渐入佳境之兆！时机刚好，虽非大富大贵，但步步向好，稳中有升。',
        career:   '学业事业渐有起色。保持恒心，如燕子筑巢，一步一脚印，成功就在前方。',
        love:     '感情需耐心经营。良缘已在路上，不必焦虑。已有伴侣者需多些包容理解。',
        health:   '身体尚可，但需注意劳逸结合。莫因忙碌忽视小病小痛。',
      }
    },
    {
      id: 4, level: '上吉签',
      poem: '梅开雪后暗香浮，铁骨冰心自不孤。\n待到东风回暖日，千红万紫绘新图。',
      allusion: '「韩信胯下之辱」—— 韩信少年时受胯下之辱，忍辱负重，终成汉初三杰之一。',
      oracle: {
        overall: '苦尽甘来之兆！眼前的困难只是暂时的，坚持过去便是春暖花开。',
        career:   '学业事业暂有阻碍，但根基扎实。熬过这段时间，春天必来。宜坚守本心。',
        love:     '需经考验方见真心。暂时的冷淡不代表缘尽，给对方也给自己一点时间。',
        health:   '注意防寒保暖。小病小恙无需过度担忧，静养即可恢复。',
      }
    },
    {
      id: 5, level: '上吉签',
      poem: '清风明月两相宜，山水之间有鶴栖。\n淡泊明志心常泰，是非不到白云西。',
      allusion: '「陶渊明归隐」—— 陶渊明不为五斗米折腰，归隐田园，采菊东篱下，悠然见南山。',
      oracle: {
        overall: '清净平和之兆！心静则万事顺，不必刻意追逐，随缘自有好结果。',
        career:   '按部就班即是上策。不宜冒进，稳扎稳打成绩更好。适合专注学业。',
        love:     '平淡中见真情。不必羡慕轰轰烈烈，细水长流的感情最长久。',
        health:   '心态平和是最好良药。适合练习静坐、太极等养生之法。',
      }
    },
    {
      id: 6, level: '上吉签',
      poem: '金鳞本是池中物，一遇风云便化龙。\n莫笑今朝栖浅水，他年直上九霄重。',
      allusion: '「刘备三顾茅庐」—— 诸葛亮隐居隆中，得刘备三顾相请，出山后成就三分天下大业。',
      oracle: {
        overall: '蓄势待发之兆！你本有才，只待时机。贵人即将出现，助你一飞冲天。',
        career:   '才华即将得到认可。可能有重要人物赏识你，关键机会不要错过。',
        love:     '真正懂你的人即将出现。不要将就，你值得最好的缘分。',
        health:   '体质不错，但需适当锻炼以保持状态。精力充沛时多做运动。',
      }
    },
    {
      id: 7, level: '上吉签',
      poem: '雨后青山分外明，尘埃洗尽见真情。\n莫因小事生烦恼，心底无私天地清。',
      allusion: '「六祖惠能」—— 禅宗六祖惠能大师言：本来无一物，何处惹尘埃。',
      oracle: {
        overall: '拨云见日之兆！困扰你的烦恼即将消散，真相和答案很快显现。',
        career:   '之前的疑惑将得到解答。考试顺利，思路清晰。工作中误解将消除。',
        love:     '坦诚沟通可化解矛盾。有误会就主动解释，真诚最能打动人。',
        health:   '心态放松后身体自然好转。不必过度焦虑，许多症状源于心结。',
      }
    },
    {
      id: 8, level: '上吉签',
      poem: '松柏青青耐岁寒，风霜不改旧时颜。\n守得云开星月现，初心不负即平安。',
      allusion: '「苏武牧羊」—— 苏武出使匈奴被扣，牧羊北海十九年，持节不屈，终得归汉。',
      oracle: {
        overall: '守正待时之兆！坚持做对的事，不必在意外界纷扰。时间会证明一切。',
        career:   '学习工作需持之以恒。不为外界诱惑所动，专注本业，终有大成。',
        love:     '忠诚与信任是感情的基石。远距离或暂时困难都不可怕，初心在则情不散。',
        health:   '身体底子不错，保持规律作息就好。季节交替时注意保暖。',
      }
    },

    // ═══ 中签 (12支) ═══
    {
      id: 9, level: '中签',
      poem: '花开两朵各东西，一树春风有两歧。\n欲问前程何处好，心平气和自能知。',
      allusion: '「歧路亡羊」—— 杨朱之邻人追羊，因岔路太多而迷失方向。心乱则事迷。',
      oracle: {
        overall: '面临选择之兆！两条路各有优劣，不必急躁，静下心来答案自明。',
        career:   '学业或职业可能面临分叉路口。听听长辈建议，但最终遵循本心。',
        love:     '可能有多个选择，或者面临重要决定。不要冲动，让时间来验证。',
        health:   '身体无大碍。若有两套养生方案可选，选自己更能坚持的那一个。',
      }
    },
    {
      id: 10, level: '中签',
      poem: '船到桥头水自直，何须苦苦用心机。\n随缘任运逍遥过，春去秋来总有时。',
      allusion: '「庄子逍遥游」—— 庄周梦蝶，物我两忘。顺应自然，不强求，不妄为。',
      oracle: {
        overall: '顺其自然之兆！有些事情强求不得，放轻松反而水到渠成。',
        career:   '不必给自己太大压力。尽力而为即可，过度焦虑反而影响发挥。',
        love:     '缘分强求不来。单身者随缘，已有伴侣者给彼此空间。',
        health:   '良好的作息比任何补药都重要。保持平常心，身体自会调和。',
      }
    },
    {
      id: 11, level: '中签',
      poem: '云横秦岭家何在，雪拥蓝关马不前。\n且待天晴冰雪化，青山依旧笑开颜。',
      allusion: '「韩愈贬潮州」—— 韩愈谏迎佛骨被贬潮州，路途艰险，但终得昭雪还朝。',
      oracle: {
        overall: '暂受阻隔之兆！前进的路上有短暂停顿，但不是终点，只是中场休息。',
        career:   '学业事业暂时停滞。不必慌张，利用这段时间充电积蓄力量。',
        love:     '感情进入平淡期或暂时分离。距离产生美，小别胜新婚。',
        health:   '近期容易疲劳，需要好好休息调整。保证充足睡眠。',
      }
    },
    {
      id: 12, level: '中签',
      poem: '一盏寒灯照夜窗，十年辛苦读文章。\n功名不是朝夕事，水到渠成自放光。',
      allusion: '「范进中举」—— 范进屡试不第，坚持不辍，终在年老时中举。功夫不负有心人。',
      oracle: {
        overall: '厚积薄发之兆！成功需要时间积累，现在的付出未来必有回报。',
        career:   '学习需持之以恒，考试要有耐心。看似进展缓慢，实则根基渐固。',
        love:     '好的缘分值得等待。不要因为孤独而将就，提升自己是最好的准备。',
        health:   '注意用眼和颈椎。长时间伏案学习要注意适当活动。',
      }
    },
    {
      id: 13, level: '中签',
      poem: '蜻蜓点水过莲塘，浅浅深深各自忙。\n莫学蜻蜓轻点过，深耕一片自然香。',
      allusion: '「庖丁解牛」—— 庖丁专注解牛十九年，刀法入神。专注一事，必臻化境。',
      oracle: {
        overall: '戒浮戒躁之兆！做事不可蜻蜓点水，选定一个方向深耕才能有收获。',
        career:   '学业上需专注重点，不宜贪多。把一门课学透胜过十门课一知半解。',
        love:     '感情需用心经营，不可三心二意。专一是最好的情话。',
        health:   '分散的精力带来疲惫感。专注一两项运动或养生方式即可。',
      }
    },
    {
      id: 14, level: '中签',
      poem: '山高路远日悠悠，一步一印莫回头。\n行到水穷云起处，方知天地为君留。',
      allusion: '「玄奘西行」—— 唐僧玄奘孤身西行五万里，历经八十一难，终取真经。',
      oracle: {
        overall: '脚踏实地之兆！目标虽远，一步一步走总能到达。不必羡慕捷径。',
        career:   '学习是一场马拉松。稳扎稳打的人最终胜出，抄近路者往往半途而废。',
        love:     '长期关系靠经营而非激情。珍惜身边人，一起走过才是真感情。',
        health:   '健康是长期投资。坚持运动比偶尔剧烈锻炼更有益。',
      }
    },
    {
      id: 15, level: '中签',
      poem: '花开不择富家院，月照何分贵贱人。\n但存方寸菩提心，处处春风处处新。',
      allusion: '「观音普度」—— 观世音菩萨大慈大悲，不分贵贱，普度众生。',
      oracle: {
        overall: '心存善念之兆！好运眷顾善良的人。但行好事，莫问前程。',
        career:   '乐于助人会有意外回报。同学同事间的互相帮助带来好机会。',
        love:     '善良和温柔是最有吸引力的品质。真心的付出会得到真心的回应。',
        health:   '心怀善念者往往更健康。助人的快乐是最好的保健品。',
      }
    },
    {
      id: 16, level: '中签',
      poem: '棋逢对手局初开，胜负输赢未可猜。\n但尽己能无憾事，输赢都是好安排。',
      allusion: '「谢安围棋」—— 淝水之战时谢安与客下棋，闻捷报而不动声色。胜负置之度外。',
      oracle: {
        overall: '竞争之兆！可能面临比赛或竞争。全力以赴即无愧，结果交给天意。',
        career:   '考试或评比中放平心态。你的对手也是你的磨刀石，使你更强。',
        love:     '感情不是比赛，不要计较谁付出更多。真心不需要衡量。',
        health:   '身心状态平衡就好。不必和他人比较身材或健康指标。',
      }
    },
    {
      id: 17, level: '中签',
      poem: '落叶满阶红不扫，秋深犹有菊花香。\n繁华落尽见真淳，简简单单福更长。',
      allusion: '「刘禹锡陋室铭」—— 山不在高，有仙则名。水不在深，有龙则灵。斯是陋室，惟吾德馨。',
      oracle: {
        overall: '返璞归真之兆！简单生活有简单的快乐。不必追求花哨，平淡是真。',
        career:   '学好基础比追求技巧更重要。扎实的基本功是未来发展的根基。',
        love:     '最简单的浪漫最动人。一杯热水、一句问候，胜过千言万语。',
        health:   '简单的生活方式最养生。清淡饮食、规律作息比保健品有效。',
      }
    },
    {
      id: 20, level: '中签',
      poem: '种豆得豆理当然，种瓜岂望得芝兰。\n劝君多种菩提子，善果盈盈满玉盘。',
      allusion: '「了凡四训」—— 袁了凡被算定一生无子短命，通过积德行善改变命运，得子延寿。',
      oracle: {
        overall: '因果不爽之兆！种什么因得什么果。现在的努力就是你未来的福报。',
        career:   '学习成绩反映付出的努力。没有捷径，好好用功是最可靠的方法。',
        love:     '你怎么对待感情，感情就怎么回报你。付出真心才能收获真爱。',
        health:   '年轻时的生活方式决定未来的健康。现在开始养生也不晚。',
      }
    },

    // ═══ 下签 (8支) ═══
    {
      id: 21, level: '下签',
      poem: '浮云蔽日暗重楼，欲渡黄河冰塞舟。\n暂敛锋芒藏锐气，静待东风化解愁。',
      allusion: '「孔子困陈蔡」—— 孔子周游列国，困于陈蔡之间，绝粮七日。圣人亦有不济之时。',
      oracle: {
        overall: '暂遇阻滞之兆！近期运势低迷，诸事不宜冒进。宜静不宜动，保存实力。',
        career:   '学业事业可能遇到瓶颈。考试成绩可能不如预期。不要气馁，调整策略。',
        love:     '感情可能有波折。避免争吵升级，给彼此冷静的空间。',
        health:   '注意身体健康，不要忽视小症状。适合做个体检，防患未然。',
      }
    },
    {
      id: 22, level: '下签',
      poem: '逆水行舟用力撑，一篙松劲退千寻。\n此时若要停舟歇，恐被江流逐浪沉。',
      allusion: '「逆水行舟不进则退」—— 学如逆水行舟，不进则退。此签警示不可放松懈怠。',
      oracle: {
        overall: '不可松懈之兆！现在是关键时期，一松劲就可能前功尽弃。咬牙坚持！',
        career:   '学业关键时刻不能掉链子。即使疲惫也要保持状态，考试前尤其如此。',
        love:     '感情需要加倍的耐心维护。小矛盾可能变大问题，及时沟通化解。',
        health:   '身体发出疲劳信号时不要硬撑。适时休息是为了走更远的路。',
      }
    },
    {
      id: 23, level: '下签',
      poem: '独坐幽篁弹旧琴，知音稀少恨难禁。\n高山流水终有遇，只是来时未可寻。',
      allusion: '「伯牙绝弦」—— 伯牙善琴，钟子期死，伯牙以为世无足鼓琴者，绝弦碎琴。',
      oracle: {
        overall: '孤独之兆！近期可能感到不被理解，与周围人格格不入。但这只是暂时的。',
        career:   '学习中可能感到孤立无援。主动寻求老师同学帮助，不必独自承受。',
        love:     '可能有孤独感。但宁缺毋滥，不要因为寂寞而随意开始一段感情。',
        health:   '孤独感影响身心。多与朋友家人交流，倾诉是很好的解压方式。',
      }
    },
    {
      id: 24, level: '下签',
      poem: '秋雨梧桐叶落时，西风吹老旧年枝。\n来年春暖花重发，莫为今朝徒自悲。',
      allusion: '「黛玉葬花」—— 林黛玉见花落泪，葬花自怜。花开花落本自然，太过伤感则伤身。',
      oracle: {
        overall: '情绪低落之兆！近期容易感伤怀旧，但不必沉浸在情绪中。一切都会过去。',
        career:   '可能遇到小挫折或批评。不要全盘否定自己，这只是成长的一部分。',
        love:     '旧情难忘或感情受挫。给自己一些时间疗伤，未来还有更好的风景。',
        health:   '情绪影响身体。多晒太阳多运动，抑郁的情绪会随着汗水排解。',
      }
    },
    {
      id: 25, level: '下签',
      poem: '树大招风自古然，出头椽木朽当先。\n藏锋敛锐深涵养，不露圭角自泰然。',
      allusion: '「杨修之死」—— 杨修恃才傲物，屡次显露聪明，终被曹操所杀。聪明反被聪明误。',
      oracle: {
        overall: '低调为上之兆！近期不宜太过张扬。韬光养晦，低调行事可避是非。',
        career:   '学业中不要太过炫耀。踏实做事比炫耀聪明更能赢得尊重。谨防小人。',
        love:     '感情中低调一些更长久。不必晒给别人看，两个人的甜蜜自己知道就好。',
        health:   '身体没什么大问题。保持低调的养生习惯，不必跟风极端养生法。',
      }
    },
    {
      id: 26, level: '下签',
      poem: '大旱望云云不起，枯苗待雨雨来迟。\n天时有待君须耐，莫怨苍天莫怨时。',
      allusion: '「商汤祈雨」—— 商汤时天下大旱七年，汤以身祷于桑林，天乃大雨。至诚动天。',
      oracle: {
        overall: '等待忍耐之兆！期待的事情迟迟不来，但抱怨无用。耐心等待是最好的策略。',
        career:   '考试成绩或机会可能来得比预期慢。在等待中持续努力，不要荒废时间。',
        love:     '缘分可能姗姗来迟。把等待的时间用来提升自己，最好的总在不经意间到来。',
        health:   '慢性问题需要耐心调理。速效的方法往往不持久，慢慢来比较快。',
      }
    },
    {
      id: 27, level: '下签',
      poem: '前路茫茫雾锁江，风波处处险难防。\n小心驶得万年船，步步为营莫逞强。',
      allusion: '「赤壁之战」—— 曹操百万大军南下，因不习水战而败于赤壁。骄兵必败，谨慎为要。',
      oracle: {
        overall: '谨慎行事之兆！近期处处需小心，不可大意。做好周全准备再行动。',
        career:   '考试前要仔细复习，不能有任何侥幸心理。工作中注意细节避免出错。',
        love:     '言行需谨慎，无心之言可能伤人。多听少说，避免不必要的误会。',
        health:   '外出注意交通安全。饮食卫生需留心，以防肠胃不适。',
      }
    },
    {
      id: 28, level: '下签',
      poem: '镜花水月本来空，执念太深反受穷。\n放下心头千斤担，轻舟已过万山重。',
      allusion: '「金刚经」—— 一切有为法，如梦幻泡影，如露亦如电，应作如是观。',
      oracle: {
        overall: '放下执着之兆！你背负了太多不必要的压力。有些事放手反而更好。',
        career:   '对成绩或结果的过度执着反而影响发挥。适度关注，轻松应对。',
        love:     '执念太深伤人伤己。如果一段感情让你痛苦多于快乐，学会放手。',
        health:   '心理压力是健康大敌。学会释怀和放下，身体会感激你。',
      }
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  //  六层概率抽奖（仅在抽到吉签时开放）
  // ═══════════════════════════════════════════════════════════════

  lotteryTiers: [
    {
      id: 't1_praise', name: '暖心夸夸', prob: 0.50, emoji: '💬',
      color: '#8B7E74', heading: '🥠 今日暖心签', excitement: 1,
      items: [
        '今天你超可爱的！', '你的笑容是最好的天气~', '今天的你比昨天更美了一点点',
        '你认真起来的样子真好看！', '你的眼睛里有星星~', '今天也要记得对自己好一点哦！',
        '你是世界上最棒的小可爱！', '今天的你也是满分女孩！', '你值得世界上所有美好的东西~',
        '看到你就觉得世界都亮了✨', '你的存在就是一份礼物~', '今天也很努力呢，辛苦了！',
        '你温柔的样子太治愈了~', '每个瞬间的你都很珍贵！', '你笑起来的时候全世界都温柔了~',
        '今天的你，也是被爱包围的一天呢！', '你是独一无二的小星星~',
        '做你自己就是最棒的事情！', '你值得被温柔对待每一天~', '你今天的样子，就是最好的样子！',
      ],
    },
    {
      id: 't2_card', name: '功能卡', prob: 0.20, emoji: '🎁',
      color: '#E8A0A0', heading: '🎁 获得一张功能卡！', excitement: 2,
      items: [
        { name: '🩷 和好卡',  desc: '吵架了？小狗帮你和好！有效期24小时~' },
        { name: '🌙 哄睡卡',  desc: '今晚小狗给你讲睡前故事~' },
        { name: '🍪 零食卡',  desc: '今天允许自己多吃一包零食！' },
        { name: '📺 追剧卡',  desc: '今晚的任务：窝在被窝里追剧！' },
        { name: '😴 赖床卡',  desc: '明天早上可以多睡半小时~' },
        { name: '🎮 放纵卡',  desc: '今天允许自己玩到尽兴！' },
        { name: '🫧 泡泡浴卡', desc: '今晚奖励自己一个香香的泡泡浴！' },
        { name: '💆 按摩卡',  desc: '小狗牌肩颈按摩，免费享用~' },
        { name: '🎵 点歌卡',  desc: '小狗为你唱一首专属歌曲！' },
        { name: '☕ 摸鱼卡',  desc: '今天允许摸鱼一小时，谁说不行？' },
        { name: '💤 补觉卡',  desc: '周末允许自己睡到自然醒！' },
        { name: '🎨 涂鸦卡',  desc: '今天允许在纸上乱涂乱画发泄情绪！' },
      ],
    },
    {
      id: 't3_small', name: '小幸运', prob: 1/7, emoji: '✨',
      color: '#F0A0A0', heading: '✨ 小幸运！', excitement: 3,
      items: [
        '🎀 可爱发卡一枚！明天就戴上吧~', '💇 发带一条，明天就戴！',
        '🧦 萌袜子一双~暖到心里去！', '📔 手账贴纸一包！贴上小心情~',
        '🖊 彩色中性笔一支~每天都有好颜色！', '💅 指甲油一瓶！换个心情~',
        '📿 手机挂绳一根~可可爱爱！', '🎗 可爱钥匙扣一个！挂在包包上吧~',
        '💌 明信片一张，写给未来的自己吧~', '🌟 星星发绳一包！扎起元气马尾~',
      ],
    },
    {
      id: 't4_medium', name: '好运降临', prob: 0.10, emoji: '🌟',
      color: '#E88080', heading: '🌟 好运降临！', excitement: 4,
      items: [
        '🧋 奶茶一杯！七分甜去冰！', '🍰 小蛋糕一块！甜到心里的那种~',
        '🎬 电影票一张！今晚就去！', '📚 喜欢的二手书一本~在书里躲一躲',
        '🍜 一碗热乎乎的拉面！暖胃又暖心~', '🍦 双球冰淇淋一个！选你最爱的口味！',
        '🌯 卷饼一份，加所有爱吃的料！', '🍓 一盒新鲜的草莓~红扑扑的超甜！',
      ],
    },
    {
      id: 't5_big', name: '超级幸运', prob: 1/30, emoji: '👑',
      color: '#D06070', heading: '👑 超级幸运！！', excitement: 5,
      items: [
        '🍰 一整个草莓蛋糕！今天是什么神仙日子！',
        '🍣 回转寿司吃到饱！天哪太幸福了吧！',
        '💄 那支看了好久的口红！终于可以带回家了！',
        '🎧 可爱的耳机壳！给你的耳机穿新衣！',
        '🩰 一双毛绒拖鞋！踩上去软乎乎的！',
        '🧸 一只软乎乎的玩偶！抱在怀里超治愈~',
        '🕯 香薰蜡烛一个！让房间充满温柔的味道~',
        '👜 那个可爱的帆布包！出门就背它！',
      ],
    },
    {
      id: 't6_miracle', name: '奇迹降临', prob: 1/143, emoji: '🦄',
      color: '#C04080', heading: '🌟✨ 奇迹降临！！！✨🌟', excitement: 6,
      items: [
        '🦄 今天你就是世界上最幸运的女孩！愿望成真卡——许一个小心愿吧！',
        '🌈 奇迹发生了！小狗决定满足你一个本周内的愿望！',
        '💫 传说中的超级幸运日降临了！小狗做你的阿拉丁神灯，满足你一个小愿望！',
      ],
    },
  ],

  // ── Daoist stick state ──────────────────────────────────────
  _daoLevelKeys: null,
  _daoCumul: null,
  _daoTotalWeight: null,

  _ensureDaoCumul() {
    if (this._daoCumul) return;
    this._daoLevelKeys = Object.keys(this._levelWeights);
    this._daoTotalWeight = this._daoLevelKeys.reduce((s, k) => s + this._levelWeights[k], 0);
    let acc = 0;
    this._daoCumul = this._daoLevelKeys.map(k => {
      acc += this._levelWeights[k] / this._daoTotalWeight;
      return acc;
    });
    this._daoCumul[this._daoCumul.length - 1] = 1.0;
  },

  _drawStick() {
    this._ensureDaoCumul();
    const r = Math.random();
    let level = this._daoLevelKeys[this._daoLevelKeys.length - 1];
    for (let i = 0; i < this._daoCumul.length; i++) {
      if (r < this._daoCumul[i]) { level = this._daoLevelKeys[i]; break; }
    }
    const pool = this.sticks.filter(s => s.level === level);
    return pool[Math.floor(Math.random() * pool.length)];
  },

  // ── Lottery state ───────────────────────────────────────────
  _lotCumul: null,
  _lotTotalProb: null,

  _ensureLotCumul() {
    if (this._lotCumul) return;
    this._lotTotalProb = this.lotteryTiers.reduce((s, t) => s + t.prob, 0);
    let acc = 0;
    this._lotCumul = this.lotteryTiers.map(t => {
      acc += t.prob / this._lotTotalProb;
      return acc;
    });
    this._lotCumul[this._lotCumul.length - 1] = 1.0;
  },

  _rollLotteryTier() {
    this._ensureLotCumul();
    const r = Math.random();
    for (let i = 0; i < this._lotCumul.length; i++) {
      if (r < this._lotCumul[i]) return this.lotteryTiers[i];
    }
    return this.lotteryTiers[this.lotteryTiers.length - 1];
  },

  _pickLotteryItem(tier) {
    return tier.items[Math.floor(Math.random() * tier.items.length)];
  },

  // ── Public API ──────────────────────────────────────────────

  getToday() {
    return Storage.getFortune();
  },

  isToday(fortune) {
    return fortune && fortune.date === new Date().toDateString();
  },

  /** Returns true if the stick level is auspicious (吉) */
  isAuspicious(stick) {
    return stick && (stick.level === '上上签' || stick.level === '上吉签');
  },

  /** Draw the daily Daoist stick */
  drawStick() {
    const stick = this._drawStick();
    const result = {
      date: new Date().toDateString(),
      stickId: stick.id,
      stick: stick,
      lottery: null,
    };
    Storage.setFortune(result);
    return result;
  },

  /** Draw bonus lottery (only callable after auspicious stick) */
  drawLottery() {
    const fortune = this.getToday();
    if (!fortune || fortune.lottery) return null;
    const tier = this._rollLotteryTier();
    const item = this._pickLotteryItem(tier);
    fortune.lottery = {
      tierId: tier.id,
      tierIdx: this.lotteryTiers.indexOf(tier),
      item: item,
    };
    Storage.setFortune(fortune);
    return fortune;
  },

  // ── Rendering ───────────────────────────────────────────────

  _levelColor(level) {
    const map = { '上上签':'#C9302C', '上吉签':'#D4793A', '中签':'#6B8E6B', '下签':'#5B7B9A' };
    return map[level] || '#6B8E6B';
  },

  _levelBg(level) {
    const map = { '上上签':'#FFF0ED', '上吉签':'#FFF6EE', '中签':'#F2F7F0', '下签':'#EEF2F6' };
    return map[level] || '#F2F7F0';
  },

  _buildStickHTML(stick) {
    const levelColor = this._levelColor(stick.level);
    const levelBg = this._levelBg(stick.level);
    return `
      <div class="fortune-result-card" style="
        background: linear-gradient(180deg, ${levelBg} 0%, #FFFCF6 35%);
        border: 2px solid ${levelColor}33;
        animation: fortuneAppear 0.6s ease-out;
      ">
        <div class="fortune-level-badge" style="background:${levelColor};display:inline-block;color:#fff;padding:4px 14px;border-radius:12px;font-size:0.85rem;margin-bottom:10px;">
          第${stick.id}签 · ${stick.level}
        </div>
        <div style="font-size:1.05em;line-height:1.9;margin:10px 0;color:#4A3528;white-space:pre-line;">${stick.poem}</div>
        <div style="font-size:0.82rem;color:#8B7E74;margin:8px 0;padding:8px 12px;background:rgba(0,0,0,0.02);border-radius:8px;">
          <span style="font-weight:650;">📜 典故</span> ${stick.allusion}
        </div>
        <div style="margin-top:10px;text-align:left;">
          ${['overall','career','love','health'].map(k => {
            const icons = { overall:'🔮', career:'📚', love:'💕', health:'🍃' };
            const titles = { overall:'整体运势', career:'学业事业', love:'感情人际', health:'健康身心' };
            return `<div style="display:flex;gap:8px;padding:5px 0;font-size:0.84rem;line-height:1.5;"><span>${icons[k]}</span><div><span style="font-weight:650;">${titles[k]}</span><br><span style="color:#666;">${stick.oracle[k]}</span></div></div>`;
          }).join('')}
        </div>
        <div style="margin-top:12px;font-size:0.8rem;color:#999;text-align:center;">🏮 心诚则灵 · 每日一签 · ${stick.level} 🏮</div>
      </div>`;
  },

  _buildLotteryCard(item) {
    return `
      <div style="background:rgba(255,255,255,0.7);border-radius:10px;padding:10px 14px;margin:6px 0;text-align:left;font-size:1em;line-height:1.55;">
        <div style="font-weight:600;margin-bottom:2px;">${item.name}</div>
        <div style="color:#666;font-size:0.88em;">${item.desc}</div>
      </div>`;
  },

  _buildLotteryHTML(lottery) {
    const tier = this.lotteryTiers[lottery.tierIdx];
    const item = lottery.item;
    let bodyHTML;
    if (tier.id === 't2_card') {
      bodyHTML = this._buildLotteryCard(item);
    } else {
      bodyHTML = `<div style="font-size:${tier.excitement >= 5 ? '1.25em' : '1.05em'};line-height:1.6;">${item}</div>`;
    }

    let extrasHTML = '';
    if (tier.excitement >= 5) extrasHTML += '<div style="margin-top:8px;font-size:0.95em;">天哪天哪！！太幸运了吧！！</div>';
    if (tier.excitement >= 6) extrasHTML += '<div style="margin-top:4px;font-size:0.95em;">小狗激动得转圈圈！！！🎊🎉🦄✨🌈</div>';
    if (tier.excitement >= 4) extrasHTML += `<div style="margin-top:4px;font-size:0.85em;color:${tier.color};">好运分享给身边的人吧~</div>`;

    const glow = tier.excitement >= 5 ? `box-shadow:0 0 24px ${tier.color}66,0 0 48px ${tier.color}33;` : tier.excitement >= 4 ? `box-shadow:0 0 12px ${tier.color}44;` : '';
    const border = tier.excitement >= 4 ? `border:2px solid ${tier.excitement >= 6 ? tier.color : tier.color + '99'};` : tier.excitement >= 3 ? `border:1px solid ${tier.color}55;` : '';
    const headingSize = tier.excitement >= 6 ? '1.6em' : tier.excitement >= 5 ? '1.35em' : tier.excitement >= 4 ? '1.2em' : '1.05em';

    return `
      <div style="
        background:linear-gradient(135deg,${tier.color}15 0%,${tier.color}05 100%);
        border-radius:14px;padding:18px 16px;text-align:center;
        ${border}${glow}animation:fortuneAppear 0.5s ease-out;margin-top:12px;
      ">
        <div style="font-size:${headingSize};font-weight:700;color:${tier.color};margin-bottom:10px;">${tier.heading}</div>
        ${bodyHTML}${extrasHTML}
        <div style="margin-top:12px;font-size:0.8em;color:#999;">${tier.emoji} ${tier.name}</div>
      </div>`;
  },

  render(el) {
    const fortune = this.getToday();

    if (this.isToday(fortune)) {
      let html = this._buildStickHTML(fortune.stick);

      if (fortune.lottery) {
        html += this._buildLotteryHTML(fortune.lottery);
      } else if (this.isAuspicious(fortune.stick)) {
        // Auspicious but no lottery drawn yet → show bonus button
        html += `
          <div style="text-align:center;margin-top:12px;">
            <button id="bonus-lottery-btn" style="
              background:linear-gradient(135deg,#F9A8D4,#F472B6);
              border:none;border-radius:999px;padding:12px 28px;
              font-size:1rem;color:#fff;cursor:pointer;
              box-shadow:0 4px 14px rgba(244,114,182,0.35);
              transition:transform 0.18s,box-shadow 0.18s;
            ">🎁 吉签加持 · 额外抽奖</button>
            <div style="margin-top:6px;font-size:0.78rem;color:#aaa;">签运吉祥，额外获得一次抽奖机会！</div>
          </div>`;
      }

      el.innerHTML = html;

      // Bind bonus lottery button
      const bonusBtn = document.getElementById('bonus-lottery-btn');
      if (bonusBtn) {
        bonusBtn.addEventListener('click', () => {
          const updated = this.drawLottery();
          this.render(el);
        });
      }
      return;
    }

    // No fortune today → show Daoist draw button
    el.innerHTML = `
      <div style="text-align:center;">
        <div style="font-size:3rem;margin-bottom:8px;">🏮</div>
        <button id="fortune-btn" style="
          background:linear-gradient(135deg,#C9302C,#A02020);
          border:none;border-radius:999px;padding:14px 40px;
          font-size:1.1em;color:#fff;cursor:pointer;
          box-shadow:0 4px 18px rgba(201,48,44,0.3);
          transition:transform 0.18s,box-shadow 0.18s;
        ">摇签问卜</button>
        <div style="margin-top:10px;font-size:0.82rem;color:#aaa;">每日一签 · 心诚则灵</div>
        <div style="margin-top:4px;font-size:1.2rem;letter-spacing:4px;opacity:0.3;">🥢 🥢 🥢 🥢 🥢</div>
      </div>
    `;

    const btn = document.getElementById('fortune-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        btn.textContent = '摇签中...';
        btn.disabled = true;
        btn.style.opacity = '0.7';
        setTimeout(() => {
          this.drawStick();
          this.render(el);
        }, 1000);
      });
    }
  },
};
