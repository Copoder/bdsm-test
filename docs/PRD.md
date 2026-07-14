# BDSM Test 产品需求文档（PRD）

| 字段 | 内容 |
| --- | --- |
| 文档状态 | V1.1 Draft |
| 日期 | 2026-07-14 |
| 产品形态 | 英文、移动端优先、匿名 BDSM 自我探索测试 |
| 核心 SEO 词 | `bdsm test` |
| 商业模式 | 成人友好广告、联盟推荐、直接赞助 |
| 部署目标 | Cloudflare Pages 纯静态部署 |
| 首版语言 | English |
| 正式域名 | `https://bdsmtest.top` |

## 1. 执行摘要

本产品是一个面向 18 岁以上成年人的免费、匿名、非诊断性 BDSM 测试。用户在约 4 至 6 分钟内完成 32 个情境题，获得一个由 8 个偏好维度、主要 profile、可选次要倾向和伴侣沟通问题组成的结果；结果后可另行填写不计分、不分享的私人边界图谱。

产品以移动端体验为第一优先级，同时要求桌面端具备完整、紧凑、高效的测试和结果体验。测试、计分、结果保存、结果链接编码和分享图生成全部在浏览器内完成，原始答案不发送到服务器。用户可以生成一张 1080 x 1350 PNG 图片，也可以分享 `https://bdsmtest.top/#r=...` 形式的结果链接。接收者打开链接后先看到共享结果摘要，再由明确 CTA 开始自己的测试，形成可测量的社交传播闭环。

SEO 上，全站只有首页 `/` 以 `bdsm test` 为主要目标词。其他页面负责解释方法、角色、同意、安全与隐私，并通过内部链接把主题相关性和权重集中到首页。不得通过多个近义测试页争夺同一搜索意图，也不得把同一关键词机械重复到所有标题中。

## 2. 背景与机会

### 2.1 用户问题

搜索 `bdsm test` 的用户通常希望快速回答以下问题：

- 我更偏向 Dominant、Submissive、Switch，还是其他角色？
- 哪些情境目前更吸引我，哪些取决于条件，哪些尚未确定？
- 结果能否帮助我向伴侣表达，而不仅是一组娱乐百分比？
- 我的答案是否匿名，是否会被保存或用于画像？
- 测试是否尊重同意、边界和 BDSM 社群使用的真实术语？

现有产品普遍提供角色百分比，但常把身份、兴趣、幻想、经验和边界混为一谈。V1 的产品机会是用更清晰的测量框架和更有用的结果解释，降低用户对“结果不准”或“只有标签”的失望。

### 2.2 市场现实

当前搜索结果已有老牌与新进入者：

- [BDSMTest.org](https://www.bdsmtest.org/)：老牌精确匹配站点，宣称累计 100M+ 测试。
- [bdsmtest.co](https://bdsmtest.co/en)：30 题、8 维度、原型与伴侣对比。
- [test-bdsm.com](https://test-bdsm.com/)：16 题、快速测试、多语言、本地计算。
- [BDSM Path](https://www.bdsmpath.org/)：角色、经验、边界等多种测试和内容集群。
- [BDSMTest.ai](https://bdsmtest.ai/)：10 维度和 AI 结果解释。

因此，V1 不能只依赖精确匹配标题或域名。可持续差异必须来自测试质量、结果可用性、隐私可信度和自然分享。

## 3. 产品目标

### 3.1 P0 目标

1. 让移动端用户在 4 至 6 分钟内完成测试并获得易理解、有尊重感的结果。
2. 让首页成为全站唯一拥有 `bdsm test` 搜索意图的规范 URL。
3. 通过结果图片和可打开的结果链接形成自然传播、转化和品牌搜索增长。
4. 通过浏览器本地计算和存储建立隐私信任。
5. 构建可直接输出到 `dist/` 并部署到 Cloudflare Pages 的静态站点。
6. 保持移动端优先的同时，让 1024px 以上桌面用户获得充分利用空间、支持键盘的高质量体验。

### 3.2 P1 目标

1. 让用户通过结果页理解自己的主要偏好、混合倾向和不确定区域。
2. 为未来的伴侣对比、深度测试和广告变现保留扩展接口。
3. 建立可被性教育者、社群作者和资源页引用的方法论内容。

### 3.3 非目标

- 不提供心理、医学或精神健康诊断。
- 在完成正式心理测量验证前，不把产品称为 validated scale、psychometric assessment 或科学量表。
- 不判断用户是否“真正属于”某个身份或社群。
- 不把低分描述为不正常、保守或 `vanilla`。
- 不提供高风险活动操作教程。
- V1 不提供账号、云端保存、公开个人主页或排行榜。
- V1 不提供 AI 聊天、匹配、约会或用户生成内容。
- V1 不以 AdSense 可投放作为成立前提。

## 4. 用户与核心任务

### 4.1 主要用户

**Curious Beginner**

- 对 BDSM 有兴趣但不熟悉术语。
- 害怕被评价或留下敏感数据。
- 需要简单解释，而不是大量露骨内容。

**Self-aware Explorer**

- 已有一定认知或经验。
- 想确认倾向是否混合、是否会随情境变化。
- 在意结果是否比常见娱乐测试更细致。

**Conversation Starter**

- 希望把结果分享给伴侣。
- 需要适合公开或半公开分享的结果图片。
- 不希望边界、原始答案或私密细节出现在分享图中。

**Shared-result Visitor**

- 从朋友、伴侣或社交平台收到结果链接。
- 希望先确认对方分享了什么，再决定是否参与。
- 需要一个无需注册、可以立即开始自己测试的清晰入口。

### 4.2 Jobs to Be Done

- 当我对自己的 BDSM 偏好感到好奇时，我想快速完成一个不评判我的测试，从而获得一个可理解的起点。
- 当我的倾向不是单一角色时，我想看到混合结果，而不是被强行归类。
- 当我想和伴侣沟通时，我想分享一个克制、清晰的结果摘要，而不暴露我的全部答案和边界。
- 当我收到别人的结果时，我想快速理解这个结果，并能直接开始自己的测试进行回应或比较。

## 5. 产品原则

1. **Consent before category**：任何角色和活动都以知情、自由、可撤回的成人同意为前提。
2. **Dimensions before labels**：先展示维度，再用原型帮助理解；标签不是诊断。
3. **Preference is not identity or experience**：当前吸引力、身份认同和实际经验是不同构念；V1 只测当前自报吸引力。
4. **Private by architecture**：隐私不是一句文案，而是答案不离开设备的技术事实。
5. **Useful after the reveal**：结果必须帮助反思和沟通，不能只制造一次性惊喜。
6. **Mobile first, one-thumb ready**：核心流程应在单手、窄屏和短会话中顺畅完成。
7. **One query, one owner**：`bdsm test` 由首页独占，支持页不制造关键词内耗。
8. **Share the summary, keep the answers private**：分享只携带用户主动公开的结果摘要，不携带答案、边界或经验。

## 6. 知识库与内容边界

### 6.1 已获取的基础知识

本 PRD 获取并审阅了英文 Wikipedia 的 [BDSM](https://en.wikipedia.org/wiki/BDSM) 页面，固定版本为 [revision 1360883530](https://en.wikipedia.org/w/index.php?title=BDSM&oldid=1360883530)，页面最后修改时间为 2026-06-24。

从该资料提取的产品基础如下：

- BDSM 是 Bondage and Discipline、Dominance and Submission、Sadomasochism 的重叠总称，而不是单一兴趣。
- Top/Bottom 描述一次活动中的行动位置，Dominant/Submissive 更偏向控制关系；二者不能默认等价。
- Dominant、Submissive、Sadist、Masochist 等倾向可以交叉存在，Switch 也不必是五五分。
- BDSM 场景可以包含权力交换、约束、规则、感官强度或角色互动，但并不必然包含性交。
- 知情同意、事前协商和任何时刻可撤回同意，是 BDSM 与伤害或虐待之间的核心边界。
- SSC 与 RACK 是社群中不同的风险沟通框架，二者都不能替代具体活动的知情同意。
- 现代医学分类不应把成年人之间自愿的 BDSM 兴趣本身描述为病理。

### 6.2 交叉资料

| 资料 | 研究或专业价值 | 对本产品的影响 | 不能据此宣称 |
| --- | --- | --- | --- |
| [Kink Orientation Scale](https://pubmed.ncbi.nlm.nih.gov/39115366/) | 先由文献与焦点小组产生 27 题，再通过 200 人 EFA 和 1,025 人 CFA 保留 18 题、5 因子 | 该研究的样本与模型支持将 identity、community、paraphernalia、practice、communication 区分为不同构念；提示我们只测明确声明的构念 | 它没有验证本产品的角色原型或 8 维公式，也不能单独证明这些因子适用于全部人群 |
| [Sadomasochism Checklist](https://pubmed.ncbi.nlm.nih.gov/27488306/) | 由德国 SM 社群协助产生 24 项，分别测行为频率与吸引力，并区分 dominance/submission | 支持将吸引力与实际行为分开，并支持 Dominance、Submission 独立建模 | 不复制其受版权保护题目；不纳入其高风险活动范围 |
| [BDSM Proclivity Scale](https://pubmed.ncbi.nlm.nih.gov/35790610/) | 在 552 名大学生中识别 attitudes 与 experiences 两个因素 | 再次说明态度/兴趣不能用一个经验问题代替 | 不能外推到所有年龄、文化与 BDSM 社群 |
| [BDSM systematic scoping review](https://pubmed.ncbi.nlm.nih.gov/31617765/) | 汇总 60 篇研究，发现病理模型支持有限，BDSM 更适合视为多样性兴趣和行为 | 结果文案保持非病理化，不用创伤或人格解释用户偏好 | 不能说明每位个体都没有心理或关系困扰 |
| [Consent Norms in the BDSM Community](https://pubmed.ncbi.nlm.nih.gov/39576567/) | 202 名实践者普遍支持严格同意沟通，但长期关系中存在情境差异 | 同意文案强调明确、持续、可撤回，也承认沟通方式受关系情境影响 | 不把 safeword 或某一种协商形式写成唯一有效形式 |
| [Sexual Consent Norms in a Sexually Diverse Sample](https://pubmed.ncbi.nlm.nih.gov/38017253/) | BDSM 社群比多数样本更常报告明确同意，且较少认为讨论同意会打断体验 | 沟通问题和教育页将 consent 作为正常交流，不作为道德分数 | 不把 consent 题目计入 kink profile 高低 |
| [Clinical Guidelines for Working with Clients Involved in Kink](https://pubmed.ncbi.nlm.nih.gov/37439228/) | 20 名有经验的临床工作者/研究者结合文献与专业经验形成指南 | 用于审阅非污名化术语、About 与方法页的专业边界 | 该指南面向临床工作，不是消费者测试量表 |
| [International BDSM survey](https://pubmed.ncbi.nlm.nih.gov/37647344/) | 1,112 名实践者显示角色、幻想、场景与文化背景存在差异 | 避免把单一文化中的角色定义写成普遍事实 | 便利样本不能代表全部搜索用户 |

NCSF 的 [Best Practices for Consent to Kink](https://ncsfreedom.org/2021/01/16/best-practices-for-consent-to-kink/) 作为社群专业资料，强调活动需要事前、明确的口头或书面同意，不能只根据肢体语言、过往行为或假设推断。

2024 年的 [BDSM Questionnaire V2](https://doi.org/10.1037/t9999-98245-000) 目前只作为待完整审阅和确认授权的研究线索。在取得完整方法、题目授权和适用范围前，不把它作为本产品评分依据。

### 6.3 知识使用规则

- 资料权威性按具体主张判断，不设置一条适用于所有问题的总排名：量表结构优先查原始测量验证研究及后续复现；总体研究结论优先查系统综述；临床措辞查专业指南；同意实践同时交叉同行评审研究与 NCSF 等社群专业资料；术语历史可用百科作导航后回到其原始来源。
- 本产品不依据任何单一研究、诊断手册或社群资料决定全部题目与分数；当来源之间存在范围、样本或定义差异时，方法页必须说明差异，不以“更权威”掩盖不确定性。
- Wikipedia 只作为术语地图和引用导航，不是权威量表，也不是可直接复制的题库。
- 竞品测试只用于搜索意图和交互研究，不用于事实、题目或计分依据。
- 所有用户可见知识文案必须能追溯到来源或经合格的性教育/心理专业审阅者确认。
- V1 发布前至少邀请三名不同视角的审阅者：一名 psychometric/research reviewer、一名 kink-aware sex educator 或 therapist、一名长期社群教育者。角色可部分重合，但不得全部由同一人承担。
- 未完成样本验证前，不得使用 `scientifically proven`、`clinical`、`diagnostic`、`most accurate` 等表述。
- 推荐表述为 `research-informed self-reflection tool`。
- 参考资料每 6 个月复核一次；任何量表、诊断或安全主张更新时记录来源、日期和修改原因。

### 6.4 当前专业性审查结论

当前 32 题方案具备以下优点：

- 明确限定为成年人之间知情同意的情境。
- Direction 与 Surrender、Intensity Giving 与 Intensity Receiving 分开，允许交叉与 Switch 结果。
- 使用非性别化、非病理化、相对克制的语言。
- 每个主维度有 4 个题目，适合作为内容验证阶段的最小 pilot item pool。

当前方案也存在明确限制：

- 8 个维度和 10 个原型来自产品假设，尚未通过 EFA/CFA、test-retest 或外部效标验证。
- Care、Play、Exploration 等维度包含多个相关但不相同的概念。
- Rigger、Rope Receiver、Brat 等原型部分依赖少量内部标签，不能解释为稳定人格类型。
- 题目均为正向措辞，可能存在同意偏差；是否加入反向题必须通过认知访谈决定，不能为了形式上的“专业”强行加入难懂题。
- 搜索用户与 BDSM 社群样本可能不同，文化、语言熟悉度和经验会影响题目理解。

因此，V1 可以公开称为 `BDSM preference test` 或 `research-informed preference map`，但不能称为 validated psychometric test。结果分数应称 `affinity score`，原型应称 `profile match`，并公开模型版本与限制。

## 7. 核心产品体验

### 7.1 完整流程

1. 用户从搜索结果进入首页。
2. 首屏立即看到 `Free BDSM Test`、预计时间、题数、匿名承诺和开始按钮。
3. 点击开始后确认：年满 18 岁；理解测试仅用于自我探索；所有情境均假设发生在知情同意的成年人之间。
4. 引导明确说明：测试测量“此刻的自报吸引力”，不测身份、经验、能力或安全知识。
5. 用户完成 32 个情境题，每题选择一个吸引力等级并确认进入下一题。
6. 完成核心题后立即在本地生成 8 维度结果、主要 profile、可选次要倾向和解释。
7. 结果交付后提供可选 `Build a private boundary map`。边界流程独立于偏好测试，可以全部跳过，且不改变任何分数。
8. 用户可以查看详情、生成分享图、生成结果链接、保存图片、重新测试或继续阅读角色/方法内容。
9. 离开后再次访问时，如本地存在未完成进度，首页提供 `Resume` 或 `Start over`。

### 7.2 回答选项

所有核心题目回答统一问题：`How appealing does this feel to you right now?`，并使用对称的五级选项：

| 用户选项 | 计分 | 额外含义 |
| --- | ---: | --- |
| `Strongly unappealing` | 0 | 当前强烈无吸引力，但不自动等于 Hard limit |
| `Somewhat unappealing` | 1 | 当前偏低吸引力 |
| `It depends / unsure` | 2 | 受对象、情境、规则或理解程度影响 |
| `Somewhat appealing` | 3 | 当前有吸引力，不代表已有经验 |
| `Strongly appealing` | 4 | 强吸引力，不代表身份承诺 |

题目顶部常驻简短前提：`Assume informed consent, prior negotiation, and adults only.`

`Private Boundary Map` 是结果后的独立非计分工具。它明确说明：`Something can be appealing and still be a boundary for practical, emotional, relational, or health reasons.`

边界 map 使用以下非数值选项：

- `Hard limit`
- `Depends on conditions`
- `Open to discuss`
- `Prefer not to answer`

V1 边界类别为：giving control、receiving control、rules/protocol、physical restraint、strong sensation、consensual pain、humiliation/degradation、service, role/scenario play、public visibility、involving additional people、aftercare needs。所有类别只用于私人沟通准备，不推断安全性，不提供实践教程，也不进入 profile 或分享。

### 7.3 交互规则

- 用户选择答案后选项保持高亮，由固定位置的 `Continue` 按钮确认进入下一题。不得因方向键改变 radio 选项而自动切题。
- 始终提供返回上一题的图标按钮和可访问文本。
- 章节结束时显示短暂进度反馈，不使用随机奖励或操纵性连续签到。
- 不允许跳过核心题；用户可选择 `It depends / unsure` 表达不确定。结果后的 Private Boundary Map 可以全部跳过。
- 题目在 UI 中不得按维度连续展示。使用固定的平衡交错顺序：`Q1,Q5,Q9,Q13,Q17,Q21,Q25,Q29`，随后按相同维度顺序展示各组第二、第三、第四题，减少用户猜测计分结构和连续同意偏差。
- `localStorage` 可用时，浏览器刷新或意外关闭后从最近完成题恢复；memory-only 模式按隐私章节的降级规则处理。
- 测试过程中不出现广告、导航菜单、外链或邮件订阅。

## 8. 测量模型

### 8.1 八个维度

| ID | 维度 | 测量内容 | 不代表 |
| --- | --- | --- | --- |
| DIR | Direction | 设定节奏、规则、结构和承担引导责任的吸引力 | 控制日常关系或忽视同意 |
| SUR | Surrender | 在协商范围内交出控制、接受引导和服从结构的吸引力 | 软弱或在所有情境中服从 |
| IGV | Intensity Giving | 给予受控强烈感受、观察反应和调节强度的吸引力 | 对非自愿伤害的兴趣 |
| IRC | Intensity Receiving | 在协商情境中接受强烈感受、挑战或忍耐的吸引力 | 日常生活中喜欢受伤 |
| RST | Restraint & Craft | 约束、被约束、工具、技巧和限制移动的吸引力 | 自动等于 Dominant/Submissive |
| CAR | Service & Care | 服务、照顾、责任、仪式和 aftercare 的吸引力 | 固定性别角色 |
| PLY | Play & Challenge | 调皮抵抗、规则游戏、挑战与互动张力的吸引力 | 真实拒绝或违反同意 |
| EXP | Exploration & Ritual | 新颖体验、情境、氛围、角色和事前设计的吸引力 | 无边界或追求高风险 |

### 8.2 32 题 V1 蓝图

以下 32 题是内容蓝图，不是锁定量表。正式实现前应为每个维度再产生至少 2 个替代题，形成 48 题内部 candidate pool；通过专家内容审阅和认知访谈后，每个维度保留 4 题进入用户版。不得只因当前题目已经写入 PRD 就跳过删改，也不得直接宣称为已验证量表。

#### Direction

1. `Setting the pace and structure of a consensual scene feels appealing to me.`
2. `I like the idea of a partner looking to me for clear decisions within agreed limits.`
3. `Creating rules for a scene, then taking responsibility for them, appeals to me.`
4. `Guiding another person through anticipation and resolution sounds appealing.`

#### Surrender

5. `Letting a trusted partner set the pace within negotiated limits feels appealing.`
6. `Following clear instructions in a consensual scene sounds freeing to me.`
7. `Temporarily handing over decisions to someone I trust feels exciting.`
8. `Being held to agreed expectations appeals to me.`

#### Intensity Giving

9. `Carefully creating strong sensations for a consenting partner appeals to me.`
10. `Watching a partner's reactions and adjusting the intensity sounds satisfying.`
11. `Building intensity toward a clearly agreed limit feels appealing.`
12. `Controlled discomfort can be an appealing part of a consensual scene for me to give.`

#### Intensity Receiving

13. `Experiencing strong sensations within clear limits feels appealing to me.`
14. `A consensual test of endurance or composure sounds exciting.`
15. `Letting a trusted partner build intensity while I stay present appeals to me.`
16. `Controlled discomfort can be an appealing part of a consensual scene for me to receive.`

#### Restraint & Craft

17. `Restraining a consenting partner with care and skill sounds appealing.`
18. `Being safely restrained by someone I trust sounds appealing.`
19. `The planning, precision, or visual craft of restraint interests me.`
20. `Limited movement can heighten anticipation for me.`

#### Service & Care

21. `Taking care of a partner before, during, and after an intense experience feels meaningful and appealing.`
22. `Doing meaningful acts of service within an agreed dynamic appeals to me.`
23. `Receiving attentive care after a demanding experience feels appealing.`
24. `An agreed ritual of responsibility, permission, or appreciation appeals to me.`

#### Play & Challenge

25. `Playful resistance inside clearly agreed rules sounds exciting.`
26. `Teasing or testing an agreed power dynamic can add enjoyable tension for me.`
27. `Earning an agreed consequence through playful behavior appeals to me.`
28. `A dynamic with wit, challenge, and back-and-forth energy suits me.`

#### Exploration & Ritual

29. `Exploring an unfamiliar but negotiated dynamic feels appealing.`
30. `Atmosphere, anticipation, and ritual feel appealing to me.`
31. `Stepping into a role or carefully designed scenario sounds engaging.`
32. `Designing a consensual scene together in advance feels like part of the appeal.`

### 8.3 题目标签

除主维度外，每题可以有一个或多个只用于原型计算的内部标签：

- `control-giving`
- `control-receiving`
- `sensation-giving`
- `sensation-receiving`
- `restraint-giving`
- `restraint-receiving`
- `service-care-giving`
- `care-receiving`
- `playful-resistance`
- `challenge`
- `craft`
- `ritual-planning`
- `novelty-role`

标签和权重属于版本化静态配置，不写死在 UI 组件中。

各标签在 V1 中使用以下固定题目集合，标签分数均为所列题目回答分数的归一化平均值：

| 标签 | 题目 |
| --- | --- |
| `control-giving` | Q1, Q2, Q3, Q4 |
| `control-receiving` | Q5, Q6, Q7, Q8 |
| `sensation-giving` | Q9, Q10, Q11, Q12 |
| `sensation-receiving` | Q13, Q14, Q15, Q16 |
| `restraint-giving` | Q17 |
| `restraint-receiving` | Q18, Q20 |
| `craft` | Q19 |
| `service-care-giving` | Q21, Q22 |
| `care-receiving` | Q23 |
| `ritual-planning` | Q24, Q30, Q32 |
| `playful-resistance` | Q25, Q27 |
| `challenge` | Q26, Q28 |
| `novelty-role` | Q29, Q31 |

## 9. 计分与结果规则

### 9.1 维度分数

- 每个维度由 4 道题组成。
- 维度分数 = 该维度实际得分 / 16 x 100，四舍五入为整数。
- 分数表示本次回答中的 `affinity`，不是相对于人口样本的百分位。
- 核心吸引力回答按 0、1、2、3、4 连续计分；Hard limit 是独立 Boundary Map 中的非数值类别，不进入任何维度或原型公式。
- 不展示 `You are 87% Dominant` 这类身份断言；展示 `Direction affinity: 87`。

### 9.2 原型候选

所有公式输入均为 0 至 100。`BAL = 100 - abs(DIR - SUR)`。V1 原型匹配分定义如下：

| 原型 | V1 匹配分公式 |
| --- | --- |
| Dominant | `0.70*DIR + 0.15*service-care-giving + 0.15*ritual-planning` |
| Submissive | `0.70*SUR + 0.15*service-care-giving + 0.15*care-receiving` |
| Switch | DIR 与 SUR 都 >= 60 时：`0.35*DIR + 0.35*SUR + 0.30*BAL`；否则：`0.80*min(DIR,SUR)` |
| Sensation Giver | `0.75*IGV + 0.15*DIR + 0.10*service-care-giving`；解释中可注明 `sadist-leaning` 社群术语 |
| Sensation Receiver | `0.75*IRC + 0.15*SUR + 0.10*care-receiving`；解释中可注明 `masochist-leaning` 社群术语 |
| Rigger | `0.55*restraint-giving + 0.25*craft + 0.20*DIR` |
| Rope Receiver | `0.65*restraint-receiving + 0.20*SUR + 0.15*RST`；正文解释常见术语 `rope bunny` |
| Caregiver | `0.55*service-care-giving + 0.25*DIR + 0.20*ritual-planning` |
| Brat | `0.65*playful-resistance + 0.20*challenge + 0.15*SUR` |
| Experimentalist | `0.60*EXP + 0.20*PLY + 0.10*IGV + 0.10*IRC` |

公式是首版产品启发式模型，不代表已验证的心理测量结构。模型版本必须显示在方法页，并可在后续验证后升级为新版本。

### 9.3 原型展示逻辑

- 对每个候选按上一节公式计算 0 至 100 的未取整匹配分，权重作为单独的 `scoring.v1.json` 配置维护。
- 展示规则按固定优先级执行：先判断低匹配回退，再判断 blended，最后生成普通主要/次要结果。
- 如果最高匹配低于 45，立即使用 `Open-ended Explorer`，不再判断 blended，也不显示次要原型。该规则高于所有分差规则。
- 只有最高匹配不低于 45 时，最高与第二高相差 7 分以内才显示 blended profile，例如 `Dominant / Caregiver`。
- Switch 只在 Direction 与 Surrender 都不低于 60 时使用完整公式；否则使用降权公式。
- 比较阈值时使用未取整分数；只在显示时四舍五入。完全并列时按用户最高的相关主维度决定顺序，仍并列则按本节原型表顺序稳定排序。
- 不从性别、性取向、年龄或实际经验推断原型。
- 所有用户使用中性措辞 `Your current answers suggest...`。结果不得从分数推断经验、能力、身份稳定性或真实实践行为。
- blended profile 的分享字段只有一个 `Primary profile`，值为组合名称，例如 `Dominant / Caregiver`；不设置 Secondary tendency，第三名仅作为页面中的 `Supporting tendency`，不进入分享图或链接。
- `Open-ended Explorer` 的页面和分享图都只显示这一个 Primary profile，不显示次要原型或 Supporting tendency。
- 普通非 blended 且非 Open-ended 结果显示第一名为 Primary profile、第二名为 Secondary tendency。

### 9.4 结果结构

结果页面依次展示：

1. 主要原型名称和一句话解释。
2. 按展示规则显示次要倾向、blended profile 或 Open-ended 说明；不为 Open-ended 强行生成次要原型。
3. 8 维度横向条形图；移动端不强制使用难读的雷达图。
4. `What seems core`：固定展示最高两个维度；如果第三名与第二名相差不超过 5 分，则同时展示第三名。
5. `What may depend on context`：某维度 4 道题中至少 2 道选择 `It depends / unsure` 时进入候选，最多展示按数量和维度分排序后的前三个。
6. `Private Boundary Map`：用户完成独立工具后才显示，默认折叠，绝不进入分享图或结果链接。
7. 三个基于结果的伴侣沟通问题。
8. 方法和局限性链接。
9. 分享、下载、重新测试按钮。

结果必须包含：`This result is a reflection tool, not a diagnosis or a rule for who you are.`

每个维度预设一个沟通问题。结果选择最高两个维度的问题，再选择排名最高的 context-dependent 维度问题；如果没有 context-dependent 维度，则选择第三高维度。去重后不足三个时继续按维度分补齐：

| 维度 | 沟通问题 |
| --- | --- |
| Direction | `What kind of responsibility feels good when you are setting the pace?` |
| Surrender | `What would help you feel safe enough to hand over some control?` |
| Intensity Giving | `How would you want a partner to communicate changing intensity?` |
| Intensity Receiving | `What signals would help you stay comfortable as intensity builds?` |
| Restraint & Craft | `Which kinds of restriction feel interesting, and which are off the table?` |
| Service & Care | `What forms of care or service feel meaningful rather than assumed?` |
| Play & Challenge | `How can playful resistance stay clearly different from a real no?` |
| Exploration & Ritual | `What would make a new dynamic feel prepared rather than rushed?` |

## 10. 社交分享与裂变

### 10.1 分享卡规格

- 文件：PNG。
- 尺寸：1080 x 1350，4:5，适合主流移动社交信息流。
- 目标大小：小于 2 MB。
- 生成方式：浏览器 Canvas 2D，使用 `canvas.toBlob('image/png')`。
- 文件名：`my-bdsm-test-result.png`。
- 图片内容：
  - `My BDSM Test Result`
  - 主要原型
  - 仅普通非 blended、非 Open-ended 结果显示次要倾向；blended 和 Open-ended 结果不显示额外原型
  - 最高三个维度及简短条形图
  - `Private by design`
  - 品牌域名与 `Take the BDSM Test`
- 图片不得包含：
  - Hard limits
  - 原始答案
  - 设备或追踪 ID
  - 露骨插图

### 10.2 结果链接格式

结果链接使用首页 fragment：

`https://bdsmtest.top/#r=<versioned-base64url-payload>`

选择首页 fragment 而不是新结果路径有三个目的：

1. URL fragment 不会随目标页面的 HTTP 请求发送到 `bdsmtest.top`，只由浏览器处理，减少结果摘要进入本站服务器日志的机会。[MDN URI fragment](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)
2. 所有社交分享链接的可抓取 URL 都是首页，有利于品牌一致性和首页链接信号集中。
3. 仍然保持 Cloudflare Pages 纯静态部署，不需要动态结果页或 Functions。

V1 payload 使用唯一规范 schema；字段名、顺序和类型固定如下：

- `v`：整数 schema version，V1 固定为 `1`。
- `m`：字符串 scoring model version，例如 `"1.0.0"`。
- `p`：白名单 Primary profile。普通结果为单一名称；blended 结果直接使用规范组合名；Open-ended 结果为 `Open-ended Explorer`。
- `s`：可选的白名单 Secondary tendency，只允许出现在普通、非 blended、非 Open-ended 结果中。
- `a`：按 `DIR,SUR,IGV,IRC,RST,CAR,PLY,EXP` 固定顺序排列的 8 个 0 至 100 整数 affinity scores。

三种结果的 canonical JSON 示例：

```json
{"v":1,"m":"1.0.0","p":"Caregiver","s":"Dominant","a":[72,38,45,31,42,81,56,60]}
{"v":1,"m":"1.0.0","p":"Dominant / Caregiver","a":[78,29,51,30,47,75,49,58]}
{"v":1,"m":"1.0.0","p":"Open-ended Explorer","a":[41,36,29,33,38,44,40,43]}
```

blended 状态只编码在 `p` 中，绝不再写入 `s`；Open-ended 同样省略 `s`。解码器遇到非法字段组合必须拒绝，不自行纠正。

payload 绝不包含：

- 32 道原始答案或题目 ID。
- Hard limit 或其他 Private Boundary Map 状态。
- `It depends / unsure` 的选择位置或数量。
- 设备 ID、分析 ID、时间戳、姓名或人口属性。

编码 envelope 固定为 `<base64url>.<checksum>`：按 `v,m,p,s,a` 顺序序列化无空白 JSON，字符串使用 UTF-8，base64url 不带 padding；checksum 使用该 UTF-8 JSON bytes 的 CRC32，并输出 8 位小写十六进制。checksum 只用于发现损坏，不是数字签名或加密；纯客户端静态站无法证明结果未被修改，因此 UI 不显示 `verified`。每个 schema version 必须保存普通、blended、Open-ended 三个“canonical JSON -> 完整 envelope -> 解码对象”的黄金 fixture，编码器修改必须通过跨浏览器相同字节输出测试。生成链接前明确提示：`Anyone with this link, including the app you share it through, can see the shared summary. Your answers and private limits are not included.`

fragment 只避免 payload 在访问 `bdsmtest.top` 时进入本站 HTTP 请求。用户通过 WhatsApp、Telegram、X 等平台分享时，所选平台必然会收到完整链接；这是用户主动发起分享后的必要披露，不得描述为端到端加密或平台不可见。

接收端必须对白名单 profile、模型版本、数组长度、0 至 100 分数范围和最大 payload 长度进行校验。无效或未知版本不尝试猜测，显示通用错误状态和 `Take the BDSM Test` CTA。

### 10.3 接收者体验

检测到有效 `#r=` 后，首页进入 `Shared Result` 模式：

1. 保留简洁品牌头部。
2. 首屏显示 `A BDSM Test result was shared with you`、共享 Primary profile 和最高三个维度。
3. 在共享摘要紧邻位置显示主 CTA：`Take your own BDSM Test`。
4. CTA 下显示全部 8 维度，但不显示发送者的边界、情境项或沟通问题。
5. 显示说明：`This is a shared self-reflection result, not a verified identity or diagnosis.`
6. 页面下方再次显示测试 CTA、方法链接和首页静态教育内容。

页面启动时必须在加载分析、广告或其他第三方脚本前同步读取并校验 `#r=`。有效结果复制到内存后立即使用 `history.replaceState` 清除 fragment；无效或未知结果同样立即清除，再显示安全降级状态。Shared Result 模式不得在 fragment 清除前加载任何第三方脚本。接收的共享结果只保存在内存，不覆盖接收者自己的本地测试；点击主 CTA 直接进入年龄确认，内存中只保留 `source=shared-result` 用于无结果属性的漏斗事件。

由于社交抓取器请求不到 fragment，Open Graph 预览使用首页的通用标题与非个性化图片；个性化信息由分享文字、分享 PNG 和接收者打开后的客户端视图承担。不得为了动态 OG 把 profile 放入 query/path 或新增服务端接口。

### 10.4 分享行为

结果页提供两个明确命令，不依赖平台是否同时保留文件和 URL：

- `Share result link`：裂变主操作。优先调用 `navigator.share({ title, text, url })`，降级为复制结果链接。
- `Share result image`：视觉传播操作。生成 PNG File 后，在 `navigator.canShare({ files })` 为 true 时调用原生分享，降级为下载图片。

其他操作收进 `More sharing options` 菜单：`Copy link`、`Copy result text`、`Download image` 和平台 intent。分享失败或用户取消时不显示阻断错误，只恢复按钮状态。

`Copy result text` 只允许包含分享卡上的字段：主要 profile、普通非 blended 且非 Open-ended 结果的次要倾向、最高三个维度、非诊断说明和结果链接。它不得包含原始答案、Hard limits、Supporting tendency 或设备信息。

Web Share API 需要 HTTPS、用户主动触发，并且文件分享能力需用 `navigator.canShare()` 检查，因此下载图片必须是正式降级路径。[MDN Navigator.share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)、[MDN Navigator.canShare](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare)。

### 10.5 渠道策略

| 优先级 | 渠道 | 实现 | 主要场景 |
| --- | --- | --- | --- |
| P0 | 系统原生分享 | Web Share URL；另设 Web Share File | iOS/Android 上的 Messages、WhatsApp、Telegram、Discord、邮件及已安装应用 |
| P0 | Copy link | Clipboard API + 手动选择降级 | 所有设备，尤其 Discord、论坛、私聊 |
| P0 | WhatsApp | `api.whatsapp.com/send?text=`，URL 编码完整分享文案与链接 | 伴侣、朋友、群聊 |
| P0 | Telegram | 官方 `https://t.me/share/url?url={url}&text={text}` | 私聊、群组、频道；[Telegram Share Button](https://core.telegram.org/widgets/share) |
| P1 | Bluesky | 官方 `https://bsky.app/intent/compose?text=`，限制在 300 grapheme 内 | 公开社交分享；[Bluesky Action Intent](https://docs.bsky.app/docs/advanced-guides/intent-links) |
| P1 | X | Web intent，发布前重新验证当前 endpoint | 公开短文本分享 |
| P1 | Reddit | 提交链接页面；不预选 subreddit，不自动发帖 | 与规则允许的相关社区 |
| P1 | Facebook | 标准 sharer URL；不嵌入 Facebook SDK | 通用社交分享 |
| P1 | Instagram / TikTok | 原生文件分享或下载 PNG，不承诺网页直接发帖 | 图片或 Story 式传播 |
| P1 | Desktop QR | 本地生成指向结果 fragment 的 QR，不调用第三方 QR 服务 | 从桌面转到手机继续分享 |

不加载任何社交平台 JavaScript SDK、像素或第三方分享组件。平台按钮只在用户点击后导航到 intent URL，并使用 `noopener,noreferrer`。按钮使用熟悉的平台图标和 tooltip，不在主结果页平铺全部渠道。

默认分享文案：`I took the BDSM Test and got [Primary profile]. See my shared result, then discover yours.` 用户发送前可以编辑。Open-ended 结果使用：`I mapped my BDSM preferences. See my shared result, then discover yours.`

### 10.6 视觉与隐私验收

- 320px 宽设备上可清晰预览，不需横向滚动。
- iOS Safari 与 Android Chrome 均验证原生文件分享或下载降级。
- Canvas 字体加载完成后才能导出，避免系统回退导致布局溢出。
- 文本必须由 Canvas 测量并换行，最长原型名不可越界。
- 分享卡与页面结果使用相同的分数快照，不允许刷新后不一致。
- 发布回归矩阵为发布时最新版和前一个主版本的 iOS Safari、Android Chrome，以及最新版桌面 Chrome。至少使用一台真实 iPhone 和一台真实 Android 设备验证原生文件分享。
- 分享链接解码后先显示共享结果和 CTA；接收结果不得写入或覆盖本地个人结果。
- 用户主动点击分享前，不得向任何第三方发送 fragment payload；访问 `bdsmtest.top` 时 Cloudflare 请求中不得包含 fragment。用户选择具体分享平台后，该平台接收完整链接属于已披露的预期行为。
- 所有平台 intent 在发布时做真实浏览器冒烟测试；平台 endpoint 失效时隐藏该按钮，不影响 Copy link 和原生分享。

## 11. 响应式体验要求

### 11.1 目标视口

- 首要测试：320 x 568、360 x 800、390 x 844、430 x 932。
- 桌面测试：1024 x 768、1280 x 800、1440 x 900、1920 x 1080。
- 移动端决定交互优先级；桌面端必须重新排版而不是简单放大手机容器。
- 支持 `safe-area-inset-*` 和动态视口单位 `dvh`。

### 11.2 测试屏

- 一次只呈现一题；320 x 568 等矮屏允许自然纵向滚动，`一屏一题` 不表示必须把题目和全部选项硬塞进一个 viewport。
- 顶部：返回按钮、章节名、进度 `12 of 32`。
- 中部：题目和必要的术语解释。
- 下部：5 个高度至少 48px 的完整选项。
- 选项之后：固定宽度的 `Continue` 主按钮，未选择时 disabled；选择后不改变布局尺寸。
- 选项布局尺寸稳定，选中状态不得推动其他内容位移。
- 正文最小 16px，按钮文字不小于 15px；不得按视口宽度连续缩放字体。
- 单手可触达主要选项；退出、隐私和方法等低频操作不占据底部主要区域。

### 11.3 可访问性

- 完整键盘操作、可见焦点和正确的 radio group 语义。
- 方向键只在 radio group 内移动选择，`Tab` 前往 `Continue`，`Enter` 或 `Space` 确认；选择本身不自动切题。
- 进度变化使用克制的 `aria-live`，避免每次切题产生冗长播报。
- 尊重 `prefers-reduced-motion`。
- 颜色不是表达选中、分数或边界的唯一方式。
- WCAG 2.2 AA 对比度目标。

### 11.4 性能预算

- 移动端 LCP < 2.5s，INP < 200ms，CLS < 0.1。
- 首页首屏 JS gzip 目标 < 120 KB。
- 自托管字体；首屏最多预加载一个 WOFF2 字体文件。
- 角色视觉资产和分享卡装饰使用经过压缩的本地资产。
- 结果区和广告位预留稳定尺寸，避免布局跳动。

### 11.5 Desktop 体验

- 全站内容最大宽度为 1180 至 1240px，正文阅读宽度保持 680 至 760px；宽屏不得出现巨大空白或过长文本行。
- 首页第一视口仍以可立即开始的 BDSM Test 为主，不转换成营销 Hero。测试入口与示例结果可以在 12 栏网格中并列，但主 CTA 必须比视觉素材更突出。
- 测试状态采用两栏工作区：左侧约 4 栏显示章节、进度、隐私事实和返回；右侧约 8 栏显示问题、radio group 与 Continue。问题区域最大宽度固定，避免眼动距离过长。
- 768 至 1023px 使用单栏或紧凑两栏，任何断点都不得出现卡片套卡片。
- 结果页在桌面采用 4/8 栏：左侧 profile 摘要和分享命令，右侧 8 个维度与解释；下方教育内容恢复正常文档宽度。
- 桌面支持数字键 `1` 至 `5` 选择答案、`Enter` 继续、`Backspace` 或显式返回按钮回到上一题；快捷键不在输入框聚焦时触发。
- hover 只能增强可点击性，所有能力必须通过键盘和触摸完成。
- 分享区桌面主操作为 `Copy result link`，其次为渠道菜单、QR 和下载图片；不假设桌面浏览器支持原生文件分享。
- 在 1920px 宽屏上，固定格式元素使用 max-width 和 grid tracks，不按视口宽度放大字体或分享卡预览。

## 12. 信息架构与 SEO

### 12.1 关键词所有权

| URL | 主要意图 | 可索引 | 与 `bdsm test` 的关系 |
| --- | --- | --- | --- |
| `/` | 立即完成 BDSM 测试 | 是 | 唯一主目标页 |
| `/methodology/` | 了解测试如何设计和计分 | 是 | 支持首页可信度 |
| `/bdsm-roles/` | 了解常见 BDSM roles | 是 | 实体与术语支持 |
| `/roles/[role]/` | 了解特定角色 | 是 | 长尾实体支持 |
| `/consent-and-safety/` | 了解同意、边界和安全原则 | 是 | 信任与教育支持 |
| `/about/` | 团队、审阅者、内容流程 | 是 | E-E-A-T 支持 |
| `/privacy/` | 隐私与本地处理说明 | 是 | 信任支持 |
| `/terms/` | 服务条款与 18+ 声明 | 是 | 法务支持 |
| `/#r=...` | 用户主动分享的结果摘要 | fragment 不单独索引 | HTTP 层仍是首页；canonical 为 `https://bdsmtest.top/` |
| 本地测试进度/私人结果 | 个体交互状态 | 否 | 不进入 URL |

禁止创建 `/bdsm-test/`、`/free-bdsm-test/`、`/bdsm-quiz/` 等重复满足同一意图的页面。

### 12.2 首页 SEO 需求

**建议 title**

`BDSM Test: Free Kink Preference Quiz | BDSMTest.top`

**建议 meta description**

`Take a free, private BDSM test to explore your current kink preferences. Get an 8-dimension profile in about 4 minutes, with an optional private boundary map.`

**H1**

`Free BDSM Test`

**首屏支持文案**

`Explore your current BDSM preferences with a private 32-question test for adults. Your result includes 8 affinity dimensions, plus an optional boundary map that stays on your device.`

**首页静态内容顺序**

1. 首屏测试入口。
2. 测试价值和隐私事实。
3. 可见的示例结果。
4. `What does this BDSM test measure?`
5. 8 个维度概览。
6. 常见角色概览。
7. 方法与局限性。
8. 同意与安全说明。
9. FAQ。
10. 相关支持页链接。

静态 HTML 必须在无 JavaScript 时仍包含完整标题、H1、介绍、方法摘要、FAQ 和内部链接。交互组件失效时，用户应看到明确的重试提示，而不是空白首屏。

### 12.3 On-page 规则

- `bdsm test` 出现在 title、H1、首段、一个 H2、meta description 和必要的内部链接中。
- 不设关键词密度 KPI；以自然、准确、可读为准。
- 每个支持页使用独立 title 和 H1，不复制首页 title 模板。
- 首页 self-canonical；HTTP、www、pages.dev 和尾斜杠版本统一。
- 唯一生产规范地址为 `https://bdsmtest.top/`；`https://www.bdsmtest.top/*` 301 到对应 apex 路径。
- 所有可索引页面在三次点击内可达，并链接回首页测试 CTA。
- 图片使用描述性文件名、尺寸属性和准确 alt 文本。
- 不发布薄弱的批量角色页；每个角色页必须包含定义、区别、常见误解、沟通提示、来源和返回测试的 CTA。

### 12.4 技术 SEO

- 生成 `/robots.txt` 并引用 `/sitemap-index.xml` 或 `/sitemap.xml`。
- sitemap 只包含 200、可索引、自规范的静态 URL。
- `https://bdsmtest.top` 为唯一 canonical host；所有生产和预览构建的 `PUBLIC_SITE_URL` 均固定为该值，不允许改成 `pages.dev`。
- `*.pages.dev` 和预览部署通过 `_headers` 返回 `X-Robots-Tag: noindex`。
- JSON-LD：`WebSite`、`WebApplication`；支持页按需使用 `BreadcrumbList` 和真实作者/审阅者信息。
- FAQ 结构化数据只能与页面可见 FAQ 完全一致，且不承诺获得富结果。
- 不存在官方通用 Quiz 富结果类型，不自创 schema。
- 404 页面返回真实 404，不把所有未知 URL 重写到首页。
- `#r=` 共享状态不出现在 sitemap，不创建动态 canonical；分享抓取器获得首页通用 Open Graph。

### 12.5 站外增长

- 发布方法论和题目设计原则，主动邀请 kink-aware 教育者审阅并署名。
- 以工具价值向性教育资源页、关系沟通博客和相关社区投稿或申请收录。
- 分享卡必须带域名和清晰的测试 CTA，推动品牌搜索和自然链接。
- 不购买批量低质外链，不在论坛机械发布精确匹配锚文本。

## 13. 商业化要求

Google Publisher Restrictions 明确把 bondage、dominance/submission、sadomasochism 等 sexual fetishes 列为受限内容；这类页面可能只有较少广告来源，甚至没有竞价。[Google Publisher Restrictions](https://support.google.com/publisherpolicies/answer/10437795?hl=en)

因此 V1 商业化要求为：

- 财务模型不得依赖 AdSense。
- 支持成人友好的广告网络、联盟推荐和直接赞助，但首发可暂不开启广告。
- 测试进行中禁止广告。
- 结果首屏、私密边界区和分享图禁止广告。
- 接收者打开共享结果后的第一视口和 `Take your own BDSM Test` CTA 周围禁止广告。
- 允许的首批广告位置：
  - 首页核心内容之后一个固定高度广告位。
  - 结果完整价值交付及分享按钮之后一个原生推荐位。
  - 角色教育页正文中的克制展示位。
- 禁止 popunder、自动播放音频、伪下载按钮、全屏强制插页和露骨创意。
- 所有广告容器预留尺寸，避免 CLS。
- 广告与联盟链接必须明确标注，不得伪装成测试建议或安全建议。

## 14. 隐私、同意与安全

### 14.1 数据最小化

- V1 不收集姓名、邮箱、出生日期、性别或性取向。
- 原始回答和 Hard limits 始终只保存在本地。维度分数和 profile 默认保存在本地，只有用户主动创建分享链接时才编码为已披露的结果摘要。
- `localStorage` 使用版本化键，例如 `bdsm-test:v1:session`。
- 用户可在结果页一键删除进度和结果。
- 读取本地状态时校验 schema version、题库 version 和数据形状；损坏、过期或未知版本数据直接丢弃并安全回到开始页。
- `localStorage` 不可用、被禁用或配额不足时进入 memory-only 模式，明确提示 `Progress will not survive a refresh on this device.`，测试仍可完成。
- 题目和计分不依赖 Cookie 或服务端会话。
- 第三方分析、广告或错误日志不得包含答案、题目 ID、维度分数、原型或分享图片内容。

### 14.2 允许的分析事件

- `page_view`
- `test_start`
- `checkpoint_8`
- `checkpoint_16`
- `checkpoint_24`
- `test_complete`
- `share_open`
- `share_success`
- `share_link_created`
- `share_channel_open`
- `image_download`
- `shared_result_view`
- `shared_result_cta_click`
- `referred_test_start`
- `referred_test_complete`
- `retake_start`

事件只用于漏斗统计，不携带结果属性、payload、profile 或具体渠道对话内容。`share_channel_open` 只允许发送白名单渠道枚举。是否启用分析由隐私政策、目标市场和同意管理方案共同决定。

### 14.3 内容安全

- 站点和测试为 18+。
- 年龄确认只在开始测试时出现，不使用阻断搜索引擎读取正文的整页门槛。
- 不出现涉及未成年人、非自愿伤害、真实暴力或无法同意者的题目。
- V1 不测试窒息、血液、刀具、药物、永久伤害等高风险具体活动。
- `consensual non-consent` 不作为 V1 题目或结果标签。
- 明确提示同意可随时撤回，过去同意不代表当前或未来同意。
- 在需要时链接当地专业支持，但不得把普通 BDSM 兴趣病理化。

## 15. 技术架构

### 15.1 技术选择

- Framework：Astro，默认静态输出。
- Language：TypeScript。
- Styling：轻量 CSS 与 design tokens，不依赖运行时 CSS-in-JS。
- Interactive test：一个按需加载的客户端 island 或框架无关 TypeScript 组件。
- Question/scoring data：版本化 JSON/TypeScript 静态配置。
- Share image：Canvas 2D + `toBlob()`。
- Shared result：versioned fragment codec + schema validation，纯客户端实现。
- Desktop QR：本地生成，不调用远程图片或短链服务。
- State：`localStorage`，内存为无存储权限时的降级。
- Hosting：Cloudflare Pages。
- Build：`npm run build`。
- Output directory：`dist`。
- Backend：无 Pages Functions、无 KV、无 D1、无 R2。

Cloudflare 当前官方 Astro Pages 指南使用 `npm run build` 和 `dist`，并提供 Git 自动部署和 PR 预览。[Cloudflare Astro Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)

### 15.2 静态部署原则

- 所有可索引路由在构建时生成 HTML。
- `PUBLIC_SITE_URL` 在生产和预览构建中都固定为 `https://bdsmtest.top`，并用于 canonical、Open Graph、JSON-LD、分享文字和分享卡域名。生产构建值不一致、缺失或仍为占位符时必须失败。
- 如构建或 QA 需要知道当前预览地址，使用独立的 `DEPLOYMENT_ORIGIN`；它不得进入 canonical、Open Graph、JSON-LD、分享 URL 或分享图。预览构建保留指向 apex 的 canonical，返回 `X-Robots-Tag: noindex`，并从预览产物中省略 sitemap，避免 `pages.dev` 成为站点发现入口。
- 测试和结果是同一首页上的客户端状态，不创建服务器路由。
- 分享图片在浏览器中生成，不上传到服务器。
- 共享结果摘要编码到 `#r=` fragment；解码器在客户端运行，服务端与 Cloudflare 不处理 payload。
- 不使用 SPA fallback；未知路径返回静态 404。
- 指纹化 JS/CSS/图片使用一年 immutable 缓存；HTML 允许快速重新验证。
- Git 主分支自动发布生产，PR 创建预览部署。

域名 `bdsmtest.top` 已于 2026-07-14 注册。PRD 更新时 DNS 尚未解析，部署任务必须完成 apex 自定义域名绑定、证书、www 301、DNSSEC 评估和 Search Console 域名资产验证。

### 15.3 Cloudflare 文件

`public/_headers` 至少覆盖：

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin` 或更严格策略
- `Permissions-Policy`，保留文件分享所需能力并关闭无关能力
- `Content-Security-Policy`
- `frame-ancestors 'none'`
- `*.pages.dev` 与预览域名 `X-Robots-Tag: noindex`
- 指纹资产长期缓存

Cloudflare Pages 支持在静态目录中的 `_headers` 配置这些响应头。[Cloudflare Pages Headers](https://developers.cloudflare.com/pages/configuration/headers/)

`public/_redirects` 负责旧路径和尾斜杠的站内重定向；域名级 www/apex 统一使用 Cloudflare Redirect Rules。不得用 200 proxy 制造重复内容。[Cloudflare Pages Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)

### 15.4 无 JavaScript降级

- 首页 SEO 正文和所有支持页面完整可读。
- 开始按钮区域提示：`JavaScript is required to run the private interactive test.`
- 不尝试在服务端提交答案。
- 用户仍可阅读角色、方法、同意和隐私内容。

## 16. 设计方向

### 16.1 概念：Tension & Craft

气质是成熟、私密、精确、非临床、非色情的现代工艺编辑风格。主题相关性来自材质、张力、连接和结构，而不是人体或性行为。

用户应记住的视觉信号是：`matte material + one red stitch + measured tension`。页面看起来像一本精心装订的私密 field guide，而不是夜店海报、色情站或心理诊所。

### 16.2 允许的暗示元素

- 极轻的黑色皮革或涂层织物颗粒，使用原创压缩 raster texture，不铺满所有区域。
- 酒红色缝线、订装线和沿网格穿行的“连接线”。
- 抽象的金属 D-ring、eyelet、扣具轮廓和 brushed steel 小面积高光。
- 绳结拓扑、张力曲线、环与连接点，但不画在人体上。
- 8 个维度各自拥有抽象功能符号，例如方向、交接、强度、约束、照护和探索。
- 分享卡可以使用材料纹理、压印式文字和结果条形图建立收藏感。

### 16.3 禁止的视觉

- 裸露、半裸、身体局部特写或性行为暗示姿势。
- 被真实束缚、蒙眼、戴口塞或处于痛苦状态的人物。
- 伤痕、瘀青、血液、刀具、窒息或危险活动。
- 色情摄影、成人图库素材、AI 生成的拟真人体 fetish 图。
- 皮鞭、手铐、锁链等作为重复背景或营销图标；若在教育内容中出现，也只能是非人体、非操作性的克制对象图。
- 紫色渐变、发光球体、bokeh、霓虹地牢和全黑页面配红色大字等成人站陈词滥调。

### 16.4 色彩与字体

- 基础：ink black、warm bone、paper white。
- 主强调：oxblood/crimson，用于 CTA、进度和单条 stitch，不大面积铺底。
- 辅助：brushed steel gray 和 muted teal，用于信息层级、隐私与安全状态，避免单一红黑配色。
- 8 个维度使用可区分、通过对比度检查的功能色；颜色之外同时使用标签和数值。
- Display 使用有编辑感的 serif 或窄体字，正文使用高可读 humanist sans；字体自托管并确认 Web 使用许可。
- 不使用 Inter、Roboto、Arial 或 Space Grotesk 作为品牌主字体；letter-spacing 固定为 0。

### 16.5 组件与版式

- 卡片圆角不超过 8px，避免页面 section 全部漂浮成卡片，也不允许卡片套卡片。
- 首页直接呈现工具入口，不制作营销式大 Hero；品牌名 `BDSMTest.top` 必须在第一视口明确出现。
- 按钮使用图标表达返回、分享、下载、复制和更多操作，并提供 tooltip；文字按钮只用于 `Start the Test`、`Continue` 等明确命令。
- 二元隐私/保存设置使用 toggle 或 checkbox，模式选择使用 segmented control，平台渠道收进 menu。
- 测试、结果条、分享图预览和进度具有稳定尺寸，hover、选中、加载和长文案不得造成重排。
- 移动端以垂直节奏和单手操作为主；桌面端使用 12 栏网格、清晰分栏和适量信息密度。

### 16.6 动效与资产

- 动效只用于进度推进、结果揭示和分享图生成完成；持续时间 160 至 320ms，减少动态模式下取消位移。
- 结果揭示可依次出现 profile、维度条和解释，但首屏 CTA 不等待动画结束。
- 首发至少包含：一张原创材料纹理、一个维度符号集、一套分享卡装饰资产。不得依赖远程图库或第三方 CDN。
- 所有资产提供明确尺寸、压缩格式和非装饰图片 alt；纯装饰纹理使用空 alt 或 CSS background。
- 分享卡要能在社交信息流中一眼看到 profile、`BDSM Test` 和 `bdsmtest.top`，同时保持可公开分享的克制程度。

## 17. 指标与埋点

### 17.1 SEO 指标

- Google Search Console 中 `bdsm test` 的 impressions、平均排名和 CTR。
- 首页索引状态与 Google 选择的 canonical。
- 非品牌自然流量中首页占比。
- 指向首页的引用域数量和自然品牌搜索增长。
- 支持页是否出现关键词内耗。

### 17.2 产品指标

| 指标 | V1 目标 |
| --- | ---: |
| 首页到测试开始率 | >= 35% |
| 开始到完成率 | >= 70% |
| 中位完成时间 | 4 至 6 分钟 |
| 结果分享面板打开率 | >= 8% |
| 结果链接创建或图片下载率 | >= 5% |
| 共享结果到开始测试转化率 | 建立全渠道聚合基线，首版目标 >= 15% |
| 分享引荐测试完成率 | 建立基线，首版目标 >= 8% |
| 7 天内重新访问率 | 建立基线，不设虚假目标 |

裂变系数按 `完成用户的分享率 x 每次分享的有效访问数 x 共享访问到完成率` 计算。由于 payload 不携带渠道或发送者 ID，也不追踪收件人身份，“有效访问数”只统计进入 Shared Result 状态的匿名会话，不做跨设备用户拼接。V1 只报告聚合的接收者转化；`share_channel_open` 可衡量发送端渠道选择，但不能与接收会话拼接，也不得被误报为按渠道转化。若未来确需渠道归因，必须另开隐私评审并在生成链接前向用户披露。

### 17.3 性能与质量指标

- Lighthouse Mobile：Performance >= 95、Accessibility >= 95、SEO = 100，作为实验室回归门槛而非真实 CWV 替代品。
- 真实 CWV 达到 Good：LCP < 2.5s、INP < 200ms、CLS < 0.1。
- 测试流程无阻断级 JavaScript 错误。
- 分享图片生成成功率 >= 99%，不支持原生分享时下载降级可用。

## 18. 验收标准

### 18.1 产品

- [ ] 用户可在 320px 宽屏幕完成 32 题，无水平滚动或文字遮挡。
- [ ] 用户可在 1024、1280、1440、1920px 桌面视口完成测试、查看结果并分享，布局充分利用空间且正文行宽受控。
- [ ] 核心回答严格使用连续 0 至 4 的对称吸引力刻度；Hard limit 只存在于结果后的独立可选 Boundary Map 且不改变分数。
- [ ] `localStorage` 可用时刷新页面可恢复进度；memory-only 模式显示不持久提示且不承诺刷新恢复。
- [ ] 损坏、旧版、配额不足和禁用的 `localStorage` 均有测试，不能导致白屏或泄露状态。
- [ ] 8 个维度和原型由同一版本化配置稳定计算。
- [ ] 计分黄金样例覆盖 8 个维度、10 个原型、Switch 的 60 分边界、7 分 blended 边界、45 分 Open-ended 边界、完全并列和显示取整。
- [ ] 交叉黄金样例证明最高分 <45 且前两名差值 <=7 时必须输出 Open-ended、无次要原型且不进入 blended 分支。
- [ ] 混合倾向和低匹配结果不会被强行归类。
- [ ] 私密边界默认折叠且不出现在分享图、URL、分析或日志中。
- [ ] 所有结果包含非诊断说明和方法链接。
- [ ] 年龄确认和成人同意前提在开始前可见并必须确认。
- [ ] 键盘、radio 语义、焦点顺序、reduced motion、对比度和屏幕阅读器流程通过可访问性验收。

### 18.2 分享

- [ ] 生成 1080 x 1350 PNG，最长文案不溢出。
- [ ] PNG 小于 2 MB，等待字体加载后导出，并与页面使用同一结果快照。
- [ ] 支持文件分享时打开原生分享面板。
- [ ] 不支持时可下载图片、复制 `#r=` 结果链接或复制结果文字。
- [ ] `Copy result text` 不包含答案、Hard limits 或设备信息。
- [ ] 分享卡只包含允许的结果摘要。
- [ ] 用户取消或分享失败后按钮恢复可用，且不会重复下载或报阻断错误。
- [ ] iOS Safari、Android Chrome 和桌面 Chrome 完成测试。
- [ ] `#r=` payload 通过版本、profile 白名单、字段组合、8 个分数范围、长度和 CRC32 校验；三个结果类型的 codec 黄金 fixture 在支持浏览器产生相同 envelope。
- [ ] 有效或无效 `#r=` 均在第三方脚本加载前解析并从地址栏清除；Shared Result 首屏先展示内存中的共享摘要和 `Take your own BDSM Test`，CTA 进入年龄确认。
- [ ] 接收的结果不覆盖本地个人结果，且链接不包含答案、Hard limits 或 context 选择。
- [ ] P0 渠道的 intent、原生分享、Copy link、PNG 下载和桌面 QR 在真实设备通过冒烟测试。

### 18.3 SEO

- [ ] `/` 是 `bdsm test` 唯一主目标和 self-canonical 页面。
- [ ] 生产 `PUBLIC_SITE_URL` 严格等于 `https://bdsmtest.top`；canonical、sitemap、JSON-LD、Open Graph 与分享卡使用同一 host。
- [ ] 无 JavaScript 时首页仍有完整 SEO 正文和内链。
- [ ] sitemap 只包含规范、可索引、200 URL。
- [ ] pages.dev 和预览域名返回 `X-Robots-Tag: noindex`。
- [ ] 结果状态不产生可索引 URL。
- [ ] title、meta、H1、Open Graph 和 JSON-LD 通过自动化检查。

### 18.4 技术

- [ ] `npm run build` 无错误并输出 `dist/`。
- [ ] 生产与预览构建的 `PUBLIC_SITE_URL` 均为 `https://bdsmtest.top`；预览地址只进入 `DEPLOYMENT_ORIGIN`，且预览必须 noindex、不得输出 pages.dev canonical 或 sitemap。
- [ ] `dist/` 可作为纯静态资产部署到 Cloudflare Pages。
- [ ] 生产流程不依赖 Functions、数据库或外部评分 API。
- [ ] `_headers`、`_redirects`、`robots.txt`、sitemap 和 404 均进入构建产物。
- [ ] 原始答案在浏览器网络面板中没有任何出站请求。

## 19. 发布计划

### Phase 0A：内容效度

- 把当前 32 题扩展为 48 题内部 candidate pool，每个维度至少 6 个候选题。
- 由 psychometric/research reviewer、kink-aware educator/therapist 和长期社群教育者分别评价相关性、清晰度、偏见、术语和风险。
- 明确每道题只测当前吸引力，不用同一题同时测经验、身份、能力、consent knowledge 或道德判断。
- 审阅者完成带姓名、日期、资质/经验、逐题意见和问题关闭状态的记录；所有 P0 内容问题关闭后才进入用户测试。

### Phase 0B：认知访谈与可用性

- 招募 15 至 20 名成年参与者做 think-aloud cognitive interview，覆盖新手、有经验者、不同性别和不同英语熟悉度。
- 检查参与者如何理解 `scene`、`intensity`、`surrender`、`restraint`、`edge/limit`、`ritual` 等词。
- 观察回答刻度是否被理解为吸引力，而不是经历过、愿意立即实践或身份标签。
- 再招募 30 至 50 名成年测试者完成移动/桌面可用性 pilot，检查时长、流失、重复、冒犯、分享理解和边界复核负担。
- 根据证据从 48 题中为每维度保留 4 题形成 32 题用户版；不通过添加营销文案解决模型问题。

### Phase 0C：发布准备

- `PUBLIC_SITE_URL=https://bdsmtest.top`，完成 DNS、证书、apex/www 301、Search Console 与 noindex 预览检查。
- 发布方法页，明确 `research-informed preference map`、模型版本、审阅者、样本范围和未验证限制。
- 在 Phase 0A/0B 完成前只允许 noindex 预览部署。

### Phase 1：MVP

- 首页测试。
- 32 题与 8 维度。
- 10 个原型和完整结果。
- 本地保存与删除。
- PNG 分享、`#r=` 结果链接、Shared Result 裂变落地状态和渠道降级。
- 方法、角色、同意、安全、隐私、About、Terms 页面。
- Cloudflare Pages 静态部署与基础 SEO。

### Phase 1.1：传播与留存

- 基于双方主动分享摘要的隐私型伴侣对比，不把原始答案或边界发往服务器。
- 更丰富的分享卡主题。
- 结果后的角色深度阅读路径。
- 在不记录敏感答案的前提下优化漏斗。

### Phase 1.2：独立心理测量验证

- 由具备 psychometrics 经验的研究者预注册分析计划；产品团队不能自行把增长实验当作效度验证。
- 使用与生产默认流程分离的明确 opt-in 研究招募。默认静态测试仍不提交答案；研究参与者必须单独知情同意。
- 初始样本至少 500，目标接近 1,000，并预先划分探索性和验证性样本；最终样本量由分析计划和模型复杂度确定。
- 评估 item performance、维度结构、内部一致性、跨关键群组的测量表现和 floor/ceiling effect。
- 至少招募 100 人在 2 至 4 周后重测，评估 test-retest；明确偏好可能真实变化，不能把所有变化视为误差。
- 在获得授权和适用性确认后，与 KOS、Sadomasochism Checklist 或其他相关测量做 convergent/discriminant validation；不复制其题目。
- 验证结果可以要求删除原型、拆分维度或重写计分。任何变化发布为新模型版本，旧分享 payload 仍可按旧版本解释。

### Phase 2：商业化验证

- 小规模测试成人友好联盟和直接赞助。
- 对广告位置进行完成率、分享率和收入的综合评估。
- 不以牺牲测试流程和隐私为代价提高展示量。

## 20. 主要风险与应对

| 风险 | 影响 | 应对 |
| --- | --- | --- |
| 量表未经验证却被理解为科学诊断 | 信任与合规风险 | 明确非诊断；公开方法；专业审阅；不做准确率承诺 |
| 多个页面同时争夺 `bdsm test` | 关键词内耗 | 首页唯一拥有该意图；支持页使用独立主题 |
| 成人主题导致广告库存不足 | 收入不稳定 | AdSense 按 0 建模；联盟、直接赞助、成人网络多元化 |
| 露骨内容触发 SafeSearch 或降低分享 | SEO 与传播下降 | 非露骨视觉与语言；高风险内容不进 V1 |
| 分享 API 浏览器支持不一致 | 分享失败 | `canShare` 检测 + PNG 下载 + URL 分享 |
| 分析或广告脚本泄露敏感结果 | 严重隐私风险 | 严格事件白名单；CSP；网络回归测试；不传结果属性 |
| 强制标签让用户感觉结果失真 | 完成后失望 | 维度优先；blended profile；低分使用 Open-ended Explorer |
| 题目过长导致移动端流失 | 完成率下降 | 用户版 32 题；一题一屏；4 至 6 分钟目标；从 48 题 candidate pool 按证据删改 |
| 分享 fragment 被误解为加密 | 隐私承诺失真 | 明确只是避免进入本站 HTTP 请求；分享平台和持链者可看到摘要 |
| 未验证原型被当作专业诊断 | 信任风险 | 使用 profile match/affinity；方法页公开限制；完成独立验证前禁止 validated/scientific 表述 |

## 21. 开放项与默认决策

| 开放项 | V1 默认决策 |
| --- | --- |
| 品牌与正式域名 | 已确定为 `BDSMTest.top` / `https://bdsmtest.top`；DNS 与 Cloudflare 绑定待实施 |
| 专业审阅者 | 至少三种审阅视角，发布前必须补齐，不伪造身份或评价 |
| 分析方案 | 默认关闭；确认隐私方案后只启用事件白名单 |
| 广告合作方 | 首发不阻塞产品发布，先保留稳定占位能力 |
| 原型命名 | 用户可见名称采用中性名称，同时解释社群常用术语 |
| 是否首版加入伴侣对比 | 不加入 Phase 1，放入 1.1，先保证核心测试与分享质量 |

## 22. Reader Test 问题

后续独立审阅者应仅根据本 PRD 回答以下问题，以发现隐含假设：

1. 哪个 URL 是 `bdsm test` 的唯一主排名页？
2. 用户答案会不会发送到 Cloudflare 或分析平台？
3. 核心吸引力回答与可选 Private Boundary Map 中的 `Hard limit` 类别有什么不同？
4. 为什么 Dominant 和 Submissive 不是一条互斥轴？
5. 什么情况下显示 Switch 或 blended profile？
6. `#r=` 分享链接包含什么、不会包含什么，谁仍然可以看到摘要？
7. 哪些内容绝不能进入分享图？
8. 为什么 V1 不应依赖 AdSense？
9. 接收分享的人如何看到结果并开始自己的测试？
10. 哪些工作必须在公开发布前完成，哪些工作完成后才能称为 validated？

## 23. 参考资料

- [Wikipedia: BDSM, revision 1360883530](https://en.wikipedia.org/w/index.php?title=BDSM&oldid=1360883530)
- [NCSF: Best Practices for Consent to Kink](https://ncsfreedom.org/2021/01/16/best-practices-for-consent-to-kink/)
- [Wignall et al.: The Kink Orientation Scale](https://pubmed.ncbi.nlm.nih.gov/39115366/)
- [Weierstall & Giebel: The Sadomasochism Checklist](https://pubmed.ncbi.nlm.nih.gov/27488306/)
- [BDSM Proclivity Among College Students](https://pubmed.ncbi.nlm.nih.gov/35790610/)
- [Brown et al.: Systematic Scoping Review of BDSM](https://pubmed.ncbi.nlm.nih.gov/31617765/)
- [Consent Norms in the BDSM Community](https://pubmed.ncbi.nlm.nih.gov/39576567/)
- [Sexual Consent Norms in a Sexually Diverse Sample](https://pubmed.ncbi.nlm.nih.gov/38017253/)
- [Clinical Guidelines for Working with Clients Involved in Kink](https://pubmed.ncbi.nlm.nih.gov/37439228/)
- [Schuerwegen et al.: BDSM in North America, Europe, and Oceania](https://pubmed.ncbi.nlm.nih.gov/37647344/)
- [APA PsycTests: BDSM Questionnaire V2](https://doi.org/10.1037/t9999-98245-000)
- [Google: Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: Title links best practices](https://developers.google.com/search/docs/appearance/title-link)
- [Google Publisher Restrictions](https://support.google.com/publisherpolicies/answer/10437795?hl=en)
- [Cloudflare Pages: Deploy an Astro site](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Cloudflare Pages: Headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages: Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [MDN: Navigator.share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)
- [MDN: Navigator.canShare](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare)
- [MDN: HTMLCanvasElement.toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)
- [MDN: URI fragment](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)
- [Telegram: Share Button](https://core.telegram.org/widgets/share)
- [Bluesky: Action Intent Links](https://docs.bsky.app/docs/advanced-guides/intent-links)
