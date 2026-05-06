import { PrismaClient, PersonaRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Demo@2025', 12)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'exec@aidemo.com' },
      update: {},
      create: { email: 'exec@aidemo.com', name: 'Alexandra Chen', passwordHash, role: 'EXECUTIVE' },
    }),
    prisma.user.upsert({
      where: { email: 'po@aidemo.com' },
      update: {},
      create: { email: 'po@aidemo.com', name: 'Marcus Johnson', passwordHash, role: 'PRODUCT_OWNER' },
    }),
    prisma.user.upsert({
      where: { email: 'ba@aidemo.com' },
      update: {},
      create: { email: 'ba@aidemo.com', name: 'Sarah Williams', passwordHash, role: 'BUSINESS_ANALYST' },
    }),
    prisma.user.upsert({
      where: { email: 'cs@aidemo.com' },
      update: {},
      create: { email: 'cs@aidemo.com', name: 'David Park', passwordHash, role: 'CUSTOMER_SERVICE' },
    }),
    prisma.user.upsert({
      where: { email: 'hr@aidemo.com' },
      update: {},
      create: { email: 'hr@aidemo.com', name: 'Emily Rodriguez', passwordHash, role: 'HR' },
    }),
    prisma.user.upsert({
      where: { email: 'finance@aidemo.com' },
      update: {},
      create: { email: 'finance@aidemo.com', name: 'Robert Chang', passwordHash, role: 'FINANCE' },
    }),
    prisma.user.upsert({
      where: { email: 'legal@aidemo.com' },
      update: {},
      create: { email: 'legal@aidemo.com', name: 'Jennifer Walsh', passwordHash, role: 'LEGAL_SOURCING' },
    }),
    prisma.user.upsert({
      where: { email: 'dev@aidemo.com' },
      update: {},
      create: { email: 'dev@aidemo.com', name: 'James Kim', passwordHash, role: 'DEVELOPER' },
    }),
    prisma.user.upsert({
      where: { email: 'gov@aidemo.com' },
      update: {},
      create: { email: 'gov@aidemo.com', name: 'Patricia Thompson', passwordHash, role: 'GOVERNANCE' },
    }),
  ])

  const solutions = await Promise.all([
    prisma.solution.upsert({
      where: { id: 'sol-001' },
      update: {},
      create: {
        id: 'sol-001',
        title: 'Intelligent Customer Support Agent',
        description: 'AI-powered support agent that resolves 70% of tier-1 tickets without human intervention using contextual understanding and knowledge base integration.',
        businessValue: 'Reduces support costs by 40%, improves CSAT scores by 25 points, and enables 24/7 global coverage without additional headcount.',
        personas: ['CUSTOMER_SERVICE', 'EXECUTIVE', 'HR'],
        category: 'Customer Experience',
        tags: ['customer-service', 'automation', 'nlp', 'cost-reduction'],
        complexity: 2,
      },
    }),
    prisma.solution.upsert({
      where: { id: 'sol-002' },
      update: {},
      create: {
        id: 'sol-002',
        title: 'AI-Powered Requirements Generator',
        description: 'Transforms business objectives into structured user stories, acceptance criteria, and technical requirements using Claude AI with domain-specific templates.',
        businessValue: 'Reduces requirements gathering time by 60%, eliminates ambiguity in specifications, and improves sprint planning accuracy.',
        personas: ['PRODUCT_OWNER', 'BUSINESS_ANALYST', 'DEVELOPER'],
        category: 'Product Development',
        tags: ['requirements', 'user-stories', 'agile', 'productivity'],
        complexity: 1,
      },
    }),
    prisma.solution.upsert({
      where: { id: 'sol-003' },
      update: {},
      create: {
        id: 'sol-003',
        title: 'Financial Forecasting Intelligence',
        description: 'Combines historical financial data with market signals and AI analysis to generate accurate quarterly forecasts with confidence intervals and risk scenarios.',
        businessValue: 'Improves forecast accuracy by 35%, reduces manual analysis time by 80%, and enables scenario planning in hours instead of weeks.',
        personas: ['FINANCE', 'EXECUTIVE'],
        category: 'Finance & Analytics',
        tags: ['forecasting', 'finance', 'analytics', 'risk'],
        complexity: 4,
      },
    }),
    prisma.solution.upsert({
      where: { id: 'sol-004' },
      update: {},
      create: {
        id: 'sol-004',
        title: 'Contract Intelligence Platform',
        description: 'Automatically reviews contracts for risk clauses, compliance issues, and unfavorable terms. Generates redlines and negotiation recommendations.',
        businessValue: 'Reduces contract review time from days to hours, identifies risk clauses with 94% accuracy, and standardizes negotiation playbooks.',
        personas: ['LEGAL_SOURCING', 'EXECUTIVE', 'FINANCE'],
        category: 'Legal & Compliance',
        tags: ['contracts', 'legal', 'compliance', 'risk-management'],
        complexity: 3,
      },
    }),
    prisma.solution.upsert({
      where: { id: 'sol-005' },
      update: {},
      create: {
        id: 'sol-005',
        title: 'HR Talent Intelligence Suite',
        description: 'AI system for resume screening, interview question generation, onboarding personalization, and employee skills gap analysis.',
        businessValue: 'Reduces time-to-hire by 45%, improves candidate quality scores, and creates personalized onboarding journeys that improve 90-day retention.',
        personas: ['HR', 'EXECUTIVE'],
        category: 'Human Resources',
        tags: ['recruitment', 'onboarding', 'talent', 'hr-automation'],
        complexity: 2,
      },
    }),
  ])

  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: 'course-001' },
      update: {},
      create: {
        id: 'course-001',
        title: 'AI Strategy for Business Leaders',
        description: 'A comprehensive course for executives on building and executing an AI transformation strategy. Learn to evaluate AI opportunities, govern AI programs, and measure ROI.',
        personas: ['EXECUTIVE', 'GOVERNANCE'],
        status: 'PUBLISHED',
        estimatedMins: 120,
        passingScore: 75,
        lessons: {
          create: [
            {
              title: 'Understanding the AI Opportunity Landscape',
              content: `# Understanding the AI Opportunity Landscape\n\nArtificial Intelligence is reshaping industries at an unprecedented pace. For business leaders, understanding where AI creates genuine value versus where it is merely hype is a critical strategic competency.\n\n## The Three Horizons of AI Value\n\n**Horizon 1: Operational Efficiency**\nAI excels at automating repetitive, rule-based tasks. Customer service automation, document processing, and data entry are prime examples. These initiatives typically show ROI within 6-12 months.\n\n**Horizon 2: Decision Enhancement**\nAI augments human decision-making by processing vast datasets and surfacing insights. Demand forecasting, risk assessment, and customer segmentation fall here. ROI appears in 12-24 months.\n\n**Horizon 3: Business Model Innovation**\nAI enables entirely new products and revenue streams. These transformative plays require 2-4 year investment horizons but deliver category-defining results.\n\n## Framework: AI Opportunity Assessment\n\nUse this four-quadrant matrix to evaluate AI initiatives:\n\n| | High Feasibility | Low Feasibility |\n|---|---|---|\n| **High Value** | Prioritize Now | Research & Pilot |\n| **Low Value** | Question Need | Deprioritize |\n\n## Key Questions for Every AI Initiative\n\n1. What specific problem does this solve?\n2. What data do we have, and is it sufficient?\n3. What does success look like, and how do we measure it?\n4. What are the risks if the AI makes mistakes?\n5. How does this align with our strategic priorities?`,
              order: 1,
              durationMin: 25,
            },
            {
              title: 'Building an AI Governance Framework',
              content: `# Building an AI Governance Framework\n\nEffective AI governance is not about limiting innovation — it is about enabling sustainable, trustworthy AI adoption at scale.\n\n## The Five Pillars of AI Governance\n\n### 1. Accountability\nEvery AI system needs a named owner responsible for its performance, fairness, and compliance. Establish clear escalation paths when AI systems behave unexpectedly.\n\n### 2. Transparency\nBusiness users and affected stakeholders should understand, at a high level, how AI systems make decisions. Document model inputs, outputs, and limitations.\n\n### 3. Fairness\nAudit AI systems for biased outcomes across demographic groups. Establish regular bias testing protocols and remediation procedures.\n\n### 4. Security\nProtect training data and model endpoints. Classify AI assets by sensitivity and apply appropriate access controls.\n\n### 5. Continuous Monitoring\nAI models drift over time as data distributions change. Establish performance baselines and automated alerts for significant degradation.\n\n## Governance Structure\n\n**AI Steering Committee** (Meets Monthly)\n- CEO or COO (chair)\n- CTO / CIO\n- Chief Risk Officer\n- Legal Counsel\n- Business Unit Leaders\n\n**AI Center of Excellence** (Operational)\n- AI Program Manager\n- Data Scientists\n- ML Engineers\n- Ethicist or Responsible AI Lead`,
              order: 2,
              durationMin: 30,
            },
            {
              title: 'Measuring AI ROI and Business Impact',
              content: `# Measuring AI ROI and Business Impact\n\nDemonstrating AI value to stakeholders requires a rigorous measurement framework that goes beyond technology metrics.\n\n## The AI Value Measurement Pyramid\n\n### Level 1: Activity Metrics (Leading Indicators)\n- Number of AI-assisted decisions\n- User adoption rates\n- System uptime and response times\n\n### Level 2: Process Metrics (Efficiency)\n- Time saved per transaction\n- Error rate reduction\n- Cost per unit of output\n\n### Level 3: Business Metrics (Outcomes)\n- Revenue impact\n- Customer satisfaction scores\n- Employee productivity\n- Risk reduction value\n\n### Level 4: Strategic Metrics (Competitive Position)\n- Market share gains\n- New revenue streams enabled\n- Innovation pipeline strength\n\n## ROI Calculation Framework\n\n**Total Benefit = Quantifiable Savings + Revenue Impact + Risk Avoidance Value**\n\n**Total Cost = Implementation + Infrastructure + Training + Ongoing Operations**\n\n**ROI = (Total Benefit - Total Cost) / Total Cost × 100**\n\n## Reporting to the Board\n\nExecutives should present AI ROI quarterly with:\n1. Program-level financial summary\n2. Top 3 value-generating initiatives\n3. Risks and mitigations\n4. Next quarter investment priorities`,
              order: 3,
              durationMin: 20,
            },
          ],
        },
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-002' },
      update: {},
      create: {
        id: 'course-002',
        title: 'AI-Powered Product Management',
        description: 'Master the tools and techniques for using AI to accelerate product discovery, backlog management, and roadmap prioritization.',
        personas: ['PRODUCT_OWNER', 'BUSINESS_ANALYST'],
        status: 'PUBLISHED',
        estimatedMins: 90,
        passingScore: 70,
        lessons: {
          create: [
            {
              title: 'AI for Customer Discovery and Insight Generation',
              content: `# AI for Customer Discovery and Insight Generation\n\nModern product managers have access to more customer data than ever before. AI makes it possible to extract signal from that noise at unprecedented speed.\n\n## Transforming Research with AI\n\n### Interview Analysis at Scale\nInstead of spending weeks synthesizing 50 customer interviews, AI can:\n- Identify common themes and pain points across all transcripts\n- Cluster feedback by customer segment\n- Surface contradictions between what customers say vs. do\n- Generate structured insight reports with supporting quotes\n\n### Behavioral Pattern Recognition\nAI analyzes usage data to reveal:\n- Feature adoption sequences that predict long-term retention\n- Drop-off points in user journeys\n- Hidden power user behaviors worth replicating\n\n## Practical Prompt Templates\n\n**For Interview Synthesis:**\n\`\`\`\nAnalyze these customer interview transcripts and provide:\n1. Top 5 jobs-to-be-done, ranked by frequency\n2. Key frustrations with current solutions\n3. Surprising or unexpected insights\n4. Recommended product hypotheses to test\n\n[PASTE TRANSCRIPTS HERE]\n\`\`\`\n\n**For Persona Development:**\n\`\`\`\nBased on the following usage data and customer quotes, develop 3 distinct user personas including: demographics, goals, frustrations, success metrics, and a day-in-the-life narrative.\n\`\`\``,
              order: 1,
              durationMin: 20,
            },
            {
              title: 'Writing Better User Stories with AI Assistance',
              content: `# Writing Better User Stories with AI Assistance\n\nWell-crafted user stories are the foundation of effective product development. AI dramatically accelerates story creation while improving quality and consistency.\n\n## The INVEST Framework + AI\n\nGood user stories are:\n- **Independent**: Can be developed without dependencies\n- **Negotiable**: Not a contract, open to discussion\n- **Valuable**: Delivers value to users or the business\n- **Estimable**: Team can estimate the effort\n- **Small**: Completable in one sprint\n- **Testable**: Clear acceptance criteria\n\nAI helps validate stories against all six criteria and suggests improvements.\n\n## AI-Assisted Story Writing Process\n\n### Step 1: Start with the Outcome\nDescribe the user goal and business objective in plain language. Don't write the story yet.\n\n### Step 2: Generate Story Options\nPrompt AI to generate 3-5 story variations with different scope boundaries.\n\n### Step 3: Expand Acceptance Criteria\nFor the chosen story, AI generates comprehensive acceptance criteria including edge cases.\n\n### Step 4: Identify Dependencies\nAsk AI to flag technical dependencies, data requirements, and design needs.\n\n## Acceptance Criteria Patterns\n\n**Given/When/Then Format:**\n- Given [context or precondition]\n- When [user action or system event]\n- Then [expected outcome]\n\nAI excels at generating multiple Given/When/Then scenarios, especially negative paths and edge cases that humans often miss.`,
              order: 2,
              durationMin: 25,
            },
            {
              title: 'AI-Enhanced Roadmap Prioritization',
              content: `# AI-Enhanced Roadmap Prioritization\n\nPrioritization is the hardest part of product management. AI helps by making implicit trade-offs explicit and processing more variables than human cognition can handle.\n\n## Common Prioritization Frameworks\n\n### RICE Scoring\n- **Reach**: How many users affected per quarter?\n- **Impact**: Effect on key metric (1-3 scale)\n- **Confidence**: How sure are we? (% certainty)\n- **Effort**: Development weeks required\n\n**RICE Score = (Reach × Impact × Confidence) / Effort**\n\nAI can auto-score features from your backlog if given sufficient context about each item.\n\n### Jobs-to-be-Done Priority Matrix\nMap features against customer jobs:\n1. Job importance (how critical is this job to the customer?)\n2. Satisfaction with current solutions\n3. Market opportunity = High Importance + Low Satisfaction\n\n## Using AI for Trade-off Analysis\n\nPresent your roadmap options to AI with constraints:\n\n\`\`\`\nGiven these 8 features for Q3, our engineering capacity of 6 teams,\nour strategic goal of improving retention by 20%, and our constraint\nto ship nothing that requires new infrastructure, rank these features\nand explain the trade-offs of each prioritization choice.\n\n[FEATURE LIST WITH ESTIMATES]\n\`\`\`\n\n## Communicating Prioritization Decisions\n\nAI generates stakeholder-friendly explanations for why items were deprioritized — turning a potentially contentious conversation into a data-driven discussion.`,
              order: 3,
              durationMin: 25,
            },
          ],
        },
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-003' },
      update: {},
      create: {
        id: 'course-003',
        title: 'Developer Productivity with AI',
        description: 'Practical techniques for developers to leverage AI for code generation, architecture decisions, debugging, and API design.',
        personas: ['DEVELOPER'],
        status: 'PUBLISHED',
        estimatedMins: 100,
        passingScore: 70,
        lessons: {
          create: [
            {
              title: 'Prompt Engineering for Code Generation',
              content: `# Prompt Engineering for Code Generation\n\nEffective code generation requires precise communication with AI. The quality of your prompts directly determines the quality of generated code.\n\n## The CODE Framework for Prompts\n\n**C — Context**: What system, language, and constraints apply?\n**O — Outcome**: What should the code accomplish?\n**D — Dependencies**: What libraries, APIs, or data structures are involved?\n**E — Examples**: Provide input/output samples when possible\n\n## High-Quality Code Prompt Examples\n\n### Basic: String Processing\n\`\`\`\nContext: TypeScript Node.js service\nWrite a function that takes an array of email addresses, validates each\nusing regex, removes duplicates (case-insensitive), and returns sorted\nresults with an error report for invalid entries.\nInclude proper TypeScript types and JSDoc.\n\`\`\`\n\n### Advanced: API Design\n\`\`\`\nContext: Express.js REST API with Prisma ORM and PostgreSQL\nDesign and implement a paginated endpoint GET /api/users that:\n- Accepts: page, limit, sortBy, sortOrder, search query params\n- Returns: { data: User[], total: number, page: number, totalPages: number }\n- Validates all inputs with Zod\n- Uses Prisma cursor-based pagination for performance\n- Handles errors with consistent { error: string, code: string } format\n\`\`\`\n\n## Common Pitfalls to Avoid\n\n1. **Too Vague**: "Write a login function" — AI doesn't know your auth strategy\n2. **Missing Constraints**: Not specifying TypeScript strict mode or error handling patterns\n3. **No Examples**: For data transformations, always provide sample input/output\n4. **Ignoring Security**: Explicitly ask for SQL injection prevention, input sanitization`,
              order: 1,
              durationMin: 30,
            },
            {
              title: 'AI-Assisted Code Review and Debugging',
              content: `# AI-Assisted Code Review and Debugging\n\nAI transforms code review from a bottleneck into an accelerator. It catches bugs, suggests improvements, and explains complex code — all instantly.\n\n## AI Code Review Checklist\n\nWhen reviewing code with AI, ask it to check for:\n\n### Security Issues\n- SQL injection vulnerabilities\n- XSS vectors\n- Exposed secrets or credentials\n- Insecure direct object references\n- Missing authentication or authorization checks\n\n### Performance Issues\n- N+1 query problems\n- Missing database indexes\n- Unnecessary re-renders (React)\n- Memory leaks\n- Blocking operations in async contexts\n\n### Code Quality\n- SOLID principle violations\n- Missing error handling\n- Overly complex functions (suggest decomposition)\n- Missing tests for edge cases\n\n## Effective Debugging with AI\n\n### The Bug Report Template\n\`\`\`\nBug: [What happens]\nExpected: [What should happen]\nError message: [Exact error text]\nContext: [Language, framework, environment]\nCode:\n[PASTE RELEVANT CODE]\n\nPlease:\n1. Identify the root cause\n2. Explain why this causes the error\n3. Provide a corrected version\n4. Suggest how to prevent this class of bug\n\`\`\`\n\n## Rubber Duck Debugging 2.0\n\nExplain your code logic to AI as if teaching a junior developer. AI will often identify the logical flaw as you describe it — or ask clarifying questions that reveal the issue.`,
              order: 2,
              durationMin: 35,
            },
            {
              title: 'Building AI-Powered Features in Your Applications',
              content: `# Building AI-Powered Features in Your Applications\n\nIntegrating AI capabilities into production applications requires careful architecture decisions beyond just calling an API.\n\n## Architecture Patterns for AI Features\n\n### Pattern 1: Synchronous AI (Simple Queries)\nBest for: Short responses under 2 seconds, non-critical features\n\`\`\`typescript\nasync function categorizeText(text: string): Promise<string> {\n  const response = await anthropic.messages.create({\n    model: 'claude-haiku-4-5-20251001',\n    max_tokens: 100,\n    messages: [{ role: 'user', content: \`Categorize: \${text}\` }],\n  })\n  return response.content[0].text\n}\n\`\`\`\n\n### Pattern 2: Streaming (Long Responses)\nBest for: Chat interfaces, document generation, code completion\n\`\`\`typescript\nasync function streamResponse(prompt: string, res: Response) {\n  res.setHeader('Content-Type', 'text/event-stream')\n  \n  const stream = anthropic.messages.stream({\n    model: 'claude-sonnet-4-5',\n    max_tokens: 2048,\n    messages: [{ role: 'user', content: prompt }],\n  })\n  \n  for await (const event of stream) {\n    if (event.type === 'content_block_delta') {\n      res.write(\`data: \${JSON.stringify({ text: event.delta.text })}\n\n\`)\n    }\n  }\n  res.write('data: [DONE]\n\n')\n  res.end()\n}\n\`\`\`\n\n### Pattern 3: Async Queue (Heavy Processing)\nBest for: Document analysis, batch processing, embedding generation\n\n## Production Considerations\n\n1. **Rate Limiting**: Implement per-user rate limits to control costs\n2. **Caching**: Cache deterministic AI responses with Redis\n3. **Fallbacks**: Define graceful degradation when AI API is unavailable\n4. **Cost Monitoring**: Track token usage per feature and user\n5. **Content Filtering**: Validate AI outputs before showing to users`,
              order: 3,
              durationMin: 35,
            },
          ],
        },
      },
    }),
  ])

  const prompts = await Promise.all([
    prisma.prompt.upsert({
      where: { id: 'prompt-001' },
      update: {},
      create: {
        id: 'prompt-001',
        title: 'User Story Generator',
        description: 'Generate well-formed user stories with acceptance criteria from a feature description',
        content: `You are an expert product manager and agile practitioner. Given the following feature description, generate a complete set of user stories.

Feature Description: [DESCRIBE YOUR FEATURE HERE]

For each user story, provide:
1. User story in "As a [persona], I want [goal], so that [benefit]" format
2. 4-6 acceptance criteria in Given/When/Then format
3. Story points estimate (Fibonacci: 1, 2, 3, 5, 8, 13)
4. Dependencies or blockers to flag
5. Edge cases to consider

Generate between 3-7 stories that decompose this feature into independently shippable increments.`,
        personas: ['PRODUCT_OWNER', 'BUSINESS_ANALYST'],
        tags: ['user-stories', 'agile', 'requirements', 'planning'],
        category: 'Product Development',
      },
    }),
    prisma.prompt.upsert({
      where: { id: 'prompt-002' },
      update: {},
      create: {
        id: 'prompt-002',
        title: 'Customer Support Response Optimizer',
        description: 'Transform rough support notes into professional, empathetic customer responses',
        content: `You are a customer service excellence specialist. Transform the following support notes into a professional, empathetic customer response.

Support Notes: [PASTE YOUR DRAFT RESPONSE OR NOTES HERE]

Customer Context:
- Issue Type: [billing / technical / product / other]
- Customer Tier: [standard / premium / enterprise]
- Issue Age: [hours / days]
- Previous Contacts: [number of prior interactions]

Requirements for your response:
1. Open with empathy and acknowledgment
2. Clearly explain what happened (if known)
3. State exact resolution steps and timeline
4. Offer a goodwill gesture if appropriate for the issue severity
5. Close with confidence in the resolution
6. Keep to under 200 words
7. Avoid jargon and passive voice

Tone: Professional yet warm. The customer should feel heard and valued.`,
        personas: ['CUSTOMER_SERVICE'],
        tags: ['customer-service', 'communication', 'support', 'empathy'],
        category: 'Customer Experience',
      },
    }),
    prisma.prompt.upsert({
      where: { id: 'prompt-003' },
      update: {},
      create: {
        id: 'prompt-003',
        title: 'Financial Variance Analysis',
        description: 'Analyze budget vs. actual variances and generate executive-ready explanations',
        content: `You are a senior financial analyst preparing a variance analysis for executive review.

Budget vs. Actual Data: [PASTE YOUR FINANCIAL DATA HERE]

Analysis Period: [Q1 2025 / Monthly / etc.]
Business Unit: [SPECIFY]

Provide:
1. Executive summary (3 sentences max)
2. Top 3 favorable variances with root cause explanation
3. Top 3 unfavorable variances with root cause explanation
4. Risk assessment: Are any variances structural (will persist) vs. timing (will reverse)?
5. Recommended actions with owner and timeline
6. Updated full-year forecast impact

Format as a structured report suitable for CFO review. Flag any items that require immediate attention in bold.`,
        personas: ['FINANCE'],
        tags: ['finance', 'analysis', 'reporting', 'variance'],
        category: 'Finance & Analytics',
      },
    }),
    prisma.prompt.upsert({
      where: { id: 'prompt-004' },
      update: {},
      create: {
        id: 'prompt-004',
        title: 'Contract Risk Review',
        description: 'Identify risky clauses and generate negotiation recommendations for contracts',
        content: `You are a legal professional reviewing a commercial contract for risk. Analyze the following contract excerpt and provide a structured risk assessment.

Contract Text: [PASTE CONTRACT SECTION HERE]

Contract Type: [SaaS / Services / Procurement / Employment / NDA / Other]
Our Position: [Buyer / Seller / Both]
Deal Value: [Approximate value or range]

Review for:
1. Liability and indemnification exposure
2. IP ownership and license scope
3. Data privacy and security obligations
4. Termination rights and penalties
5. SLA commitments and remedies
6. Payment terms and late payment provisions
7. Change of control provisions
8. Governing law and dispute resolution

Output Format:
- Risk Rating: HIGH / MEDIUM / LOW for each section
- Plain language explanation of each risk
- Recommended redline or negotiation position
- Market standard comparison where applicable

Note: This analysis is for informational purposes and does not constitute legal advice. Consult qualified legal counsel before signing.`,
        personas: ['LEGAL_SOURCING'],
        tags: ['legal', 'contracts', 'risk', 'negotiation'],
        category: 'Legal & Compliance',
      },
    }),
    prisma.prompt.upsert({
      where: { id: 'prompt-005' },
      update: {},
      create: {
        id: 'prompt-005',
        title: 'Job Description Generator',
        description: 'Create compelling, bias-free job descriptions that attract top talent',
        content: `You are an expert talent acquisition specialist and HR professional. Create a comprehensive, inclusive job description for the following role.

Role Information:
- Job Title: [TITLE]
- Department: [DEPARTMENT]
- Level: [Junior / Mid / Senior / Principal / Director]
- Team Size: [REPORTS TO / TEAM SIZE]
- Key Objectives: [2-3 main goals for this role]
- Must-Have Skills: [LIST REQUIRED SKILLS]
- Nice-to-Have Skills: [LIST PREFERRED SKILLS]
- Compensation Range: [RANGE OR "Competitive"]

Generate:
1. Compelling opening paragraph (focus on impact, not just duties)
2. Key responsibilities (6-8 bullets, outcome-oriented)
3. Required qualifications (focus on capabilities, not credentials)
4. Preferred qualifications (separate section)
5. What we offer (benefits, culture, growth)

Guidelines:
- Use gender-neutral language throughout
- Avoid unnecessary degree requirements
- Focus on skills and outcomes over years of experience
- Include a statement encouraging diverse candidates to apply
- Keep total length under 600 words`,
        personas: ['HR'],
        tags: ['recruiting', 'job-description', 'talent', 'hr'],
        category: 'Human Resources',
      },
    }),
    prisma.prompt.upsert({
      where: { id: 'prompt-006' },
      update: {},
      create: {
        id: 'prompt-006',
        title: 'Technical Architecture Review',
        description: 'Evaluate system architecture proposals and identify risks and improvements',
        content: `You are a principal software architect with expertise in distributed systems, cloud infrastructure, and enterprise software design patterns.

System Description: [DESCRIBE YOUR PROPOSED ARCHITECTURE]

Context:
- Scale: Expected users / requests per day
- Criticality: Mission-critical / Business-critical / Internal tool
- Team: Size and skill level of development team
- Timeline: When does this need to be production-ready?
- Constraints: Budget, existing tech stack, compliance requirements

Evaluate against:
1. Scalability: Can it handle 10x growth without re-architecture?
2. Reliability: What are the failure modes? SPOFs?
3. Security: Attack surface, authentication, data protection
4. Maintainability: Can a team maintain and evolve this over 3 years?
5. Cost efficiency: Are there over-engineered components for the current scale?
6. Operational complexity: Deployment, monitoring, incident response

Provide:
- Architecture score (1-10) with justification
- Top 3 strengths to preserve
- Top 3 risks with severity (Critical / High / Medium)
- Specific recommendations with implementation approach
- Alternative patterns to consider`,
        personas: ['DEVELOPER'],
        tags: ['architecture', 'system-design', 'technical-review', 'engineering'],
        category: 'Technology',
      },
    }),
    prisma.prompt.upsert({
      where: { id: 'prompt-007' },
      update: {},
      create: {
        id: 'prompt-007',
        title: 'AI Risk Assessment',
        description: 'Comprehensive AI system risk assessment for governance and compliance teams',
        content: `You are an AI governance specialist and responsible AI expert. Conduct a comprehensive risk assessment for the following AI system.

AI System Description: [DESCRIBE THE AI SYSTEM]

System Details:
- Use Case: [What decisions does this system influence or make?]
- Data Sources: [What data is used for training or inference?]
- User Base: [Who uses this system and are there vulnerable populations?]
- Integration: [What systems does this connect to?]
- Deployment: [Cloud / On-premise / Edge / Hybrid]

Assess risks across:
1. Bias and Fairness: Potential for discriminatory outcomes
2. Privacy: Data collection, retention, and exposure risks
3. Security: Adversarial attacks, model theft, data poisoning
4. Transparency: Explainability to affected individuals
5. Reliability: Failure modes and their consequences
6. Compliance: GDPR, CCPA, EU AI Act, industry regulations
7. Reputational: Brand and stakeholder trust risks

For each risk:
- Likelihood (1-5)
- Impact (1-5)
- Risk Score (Likelihood × Impact)
- Current Controls
- Recommended Mitigations
- Residual Risk

Final output: Risk rating (LOW / MEDIUM / HIGH / CRITICAL) and go/no-go recommendation.`,
        personas: ['GOVERNANCE'],
        tags: ['ai-governance', 'risk-assessment', 'compliance', 'responsible-ai'],
        category: 'Governance & Compliance',
      },
    }),
    prisma.prompt.upsert({
      where: { id: 'prompt-008' },
      update: {},
      create: {
        id: 'prompt-008',
        title: 'Executive AI Strategy Brief',
        description: 'Generate a concise AI strategy brief for board or executive committee review',
        content: `You are a management consultant specializing in digital transformation and AI strategy. Create an executive strategy brief on AI adoption.

Organization Context:
- Industry: [INDUSTRY]
- Size: [EMPLOYEES / REVENUE]
- Current AI Maturity: [None / Experimenting / Scaling / Leading]
- Strategic Priorities: [TOP 2-3 BUSINESS GOALS]
- Key Competitors: [ARE COMPETITORS USING AI? HOW?]

Structure the brief as:
1. AI Opportunity Summary (1 paragraph)
2. Recommended Priority Use Cases (top 3, with estimated ROI)
3. Investment Requirements (technology, talent, change management)
4. 18-Month Roadmap (three phases: Foundation, Pilot, Scale)
5. Risk and Governance Considerations
6. Success Metrics and KPIs
7. Recommended Next Steps (specific, actionable)

Format: Board-ready presentation style. Use data and benchmarks where possible. Total length: 600-800 words. Avoid jargon. Lead with business outcomes, not technology.`,
        personas: ['EXECUTIVE'],
        tags: ['strategy', 'executive', 'roadmap', 'transformation'],
        category: 'Strategy & Leadership',
      },
    }),
    prisma.prompt.upsert({
      where: { id: 'prompt-009' },
      update: {},
      create: {
        id: 'prompt-009',
        title: 'Process Automation Analysis',
        description: 'Identify automation opportunities in a business process and prioritize by impact',
        content: `You are a business process improvement specialist with deep expertise in AI and automation. Analyze the following process for automation opportunities.

Process Description: [DESCRIBE THE CURRENT PROCESS STEP BY STEP]

Process Context:
- Frequency: [How often is this process run?]
- Volume: [Transactions / documents / requests per period]
- Current Team: [How many people and what % of their time?]
- Pain Points: [What are the biggest frustrations?]
- Compliance Requirements: [Any regulatory constraints?]

Analysis Output:
1. Process Map: Identify each step as Manual / Automated / Hybrid
2. Automation Opportunity Score per step (1-10)
3. Recommended Automation Approach:
   - RPA (rule-based automation)
   - AI/ML (pattern recognition, prediction)
   - GenAI (content generation, decision support)
   - Hybrid (combination)
4. Implementation Complexity: LOW / MEDIUM / HIGH
5. Expected ROI per automation opportunity
6. Recommended implementation sequence
7. Change management considerations

Prioritized action plan: Which 3 automation initiatives should be launched first and why?`,
        personas: ['BUSINESS_ANALYST', 'PRODUCT_OWNER'],
        tags: ['automation', 'process-improvement', 'rpa', 'efficiency'],
        category: 'Operations',
      },
    }),
    prisma.prompt.upsert({
      where: { id: 'prompt-010' },
      update: {},
      create: {
        id: 'prompt-010',
        title: 'Supplier Risk Analysis',
        description: 'Assess supplier risk and generate sourcing strategy recommendations',
        content: `You are a procurement and supply chain risk specialist. Conduct a comprehensive supplier risk assessment.

Supplier Information: [SUPPLIER NAME AND DESCRIPTION]

Assessment Context:
- Category: [What goods/services do they provide?]
- Annual Spend: [Approximate value]
- Criticality: [Critical / Important / Preferred / Standard]
- Contract Status: [In contract / Renewing / Evaluating]
- Geography: [Supplier location and delivery regions]

Assess across risk dimensions:
1. Financial Stability: Credit risk, financial health indicators
2. Operational Risk: Capacity, quality track record, certifications
3. Geopolitical Risk: Country risk, regulatory environment
4. Concentration Risk: Single-source dependency
5. Cyber Security: Data handling, security posture
6. ESG Risk: Environmental, social, governance practices
7. Regulatory Compliance: Industry standards, certifications

For each dimension provide:
- Risk Level (GREEN / YELLOW / RED)
- Key risk factors
- Mitigation strategies
- Monitoring recommendations

Summary: Overall supplier risk rating, recommended action (Continue / Enhanced Monitoring / Develop Alternative / Replace), and negotiation leverage assessment.`,
        personas: ['LEGAL_SOURCING', 'FINANCE'],
        tags: ['procurement', 'supplier-risk', 'sourcing', 'supply-chain'],
        category: 'Legal & Compliance',
      },
    }),
  ])

  const ideas = await Promise.all([
    prisma.idea.upsert({
      where: { id: 'idea-001' },
      update: {},
      create: {
        id: 'idea-001',
        title: 'AI-Powered Onboarding Personalization Engine',
        description: 'Build an AI system that creates personalized 30-60-90 day onboarding plans for new employees based on their role, experience level, and learning style preferences.',
        businessCase: 'Our current onboarding process has a 23% early turnover rate (within 6 months). Industry data shows that personalized onboarding improves retention by 50%. With 200 new hires per year at an average replacement cost of $15,000, improving retention by even 10% saves $300,000 annually.',
        estimatedValue: '$300,000 - $500,000 annual savings',
        submittedById: users[4].id, // HR user
        status: 'UNDER_REVIEW',
        personas: ['HR', 'EXECUTIVE'],
        priority: 2,
      },
    }),
    prisma.idea.upsert({
      where: { id: 'idea-002' },
      update: {},
      create: {
        id: 'idea-002',
        title: 'Automated Contract Redlining Assistant',
        description: 'Implement an AI tool that automatically reviews incoming contracts, flags non-standard clauses, generates redlines based on our standard playbook, and summarizes key risk areas for legal review.',
        businessCase: 'Our legal team spends 40% of time on routine contract review. At $350/hour fully loaded cost and 3 FTEs, that\'s $840,000 per year on reviewable tasks. AI can handle 70% of routine reviews, freeing lawyers for high-value work and reducing outside counsel spend.',
        estimatedValue: '$500,000+ annual value',
        submittedById: users[6].id, // Legal user
        status: 'APPROVED',
        personas: ['LEGAL_SOURCING', 'FINANCE'],
        priority: 1,
      },
    }),
    prisma.idea.upsert({
      where: { id: 'idea-003' },
      update: {},
      create: {
        id: 'idea-003',
        title: 'Real-Time Customer Sentiment Dashboard',
        description: 'Create a live dashboard that aggregates customer feedback from support tickets, NPS surveys, social media, and product reviews, applying AI sentiment analysis to surface emerging issues before they escalate.',
        businessCase: 'We currently discover customer issues reactively after escalations reach leadership. A proactive sentiment monitoring system can reduce churn by catching at-risk customers early. A 1% reduction in churn on our $5M ARR base saves $50,000 annually.',
        estimatedValue: '$50,000 - $200,000 annual impact',
        submittedById: users[3].id, // Customer Service user
        status: 'SUBMITTED',
        personas: ['CUSTOMER_SERVICE', 'PRODUCT_OWNER', 'EXECUTIVE'],
        priority: 3,
      },
    }),
  ])

  await Promise.all([
    prisma.governanceReview.upsert({
      where: { id: 'review-001' },
      update: {},
      create: {
        id: 'review-001',
        ideaId: 'idea-002',
        reviewerId: users[8].id, // Governance user
        status: 'APPROVED',
        riskLevel: 'MEDIUM',
        notes: 'Approved with conditions. Requires legal team to maintain human-in-the-loop review for all contracts above $100K. AI recommendations must be logged and auditable. Quarterly bias review required for the first year.',
        reviewedAt: new Date('2025-01-15'),
      },
    }),
    prisma.governanceReview.upsert({
      where: { id: 'review-002' },
      update: {},
      create: {
        id: 'review-002',
        ideaId: 'idea-001',
        reviewerId: users[8].id, // Governance user
        status: 'NEEDS_REVISION',
        riskLevel: 'HIGH',
        notes: 'The proposal needs to address: (1) What employee data will the AI access and how is consent obtained? (2) How will we prevent the AI from inadvertently creating discriminatory onboarding tracks? (3) Data retention policy for learning style preferences. Please resubmit with a data privacy impact assessment.',
        reviewedAt: new Date('2025-01-20'),
      },
    }),
  ])

  await prisma.governancePolicy.upsert({
    where: { id: 'policy-001' },
    update: {},
    create: {
      id: 'policy-001',
      title: 'Responsible AI Use Policy v2.0',
      version: '2.0',
      content: `# Responsible AI Use Policy\n\n**Effective Date:** January 1, 2025\n**Version:** 2.0\n**Owner:** AI Governance Committee\n\n## Purpose\n\nThis policy establishes principles and requirements for the responsible development, deployment, and use of artificial intelligence systems across our organization.\n\n## Scope\n\nThis policy applies to all employees, contractors, and vendors who develop, deploy, or use AI systems on behalf of the organization.\n\n## Core Principles\n\n### 1. Human Oversight\nAll AI systems that influence consequential decisions must maintain meaningful human oversight. The degree of oversight scales with decision impact.\n\n- **Low Impact** (content suggestions, scheduling): Asynchronous review acceptable\n- **Medium Impact** (customer communications, process automation): Human review of edge cases\n- **High Impact** (hiring, lending, legal): Human decision required; AI provides support only\n\n### 2. Transparency\nWe will be transparent with stakeholders about when and how AI is used:\n- Employees must disclose AI assistance in external-facing work products\n- Customers must be informed when interacting with AI agents\n- AI-generated content must be reviewed before publication\n\n### 3. Fairness and Non-Discrimination\nAI systems must not discriminate based on protected characteristics. Requirements:\n- Bias testing required before deployment for any system affecting people decisions\n- Quarterly fairness audits for all production AI systems\n- Documented remediation process for identified bias\n\n### 4. Data Privacy\nAI systems must comply with all applicable data privacy regulations:\n- No personal data used for AI training without explicit consent\n- Minimum necessary data principle applies to all AI inputs\n- Right to explanation for consequential automated decisions\n\n### 5. Security\nAI systems are subject to our standard security review process plus:\n- Adversarial robustness testing for customer-facing systems\n- Prompt injection prevention for all LLM integrations\n- Regular red team exercises for high-impact AI systems\n\n## Approval Process\n\nAll new AI systems require review by the AI Governance Committee before production deployment:\n\n1. **Intake**: Submit AI System Registration form\n2. **Risk Assessment**: Automated scoring + governance review\n3. **Approval**: Committee review within 10 business days\n4. **Monitoring**: Quarterly reviews for approved systems\n\n## Prohibited Uses\n\nThe following uses of AI are prohibited:\n- Generating or distributing disinformation\n- Unauthorized surveillance of employees or customers\n- Making fully automated decisions in high-stakes domains without human review\n- Training AI on data obtained without proper authorization or consent\n\n## Reporting Concerns\n\nReport suspected policy violations or AI-related concerns to the AI Governance Committee at ai-governance@company.com. All reports are investigated confidentially.`,
    },
  })

  await Promise.all([
    prisma.rOIMetric.createMany({
      data: [
        { persona: 'EXECUTIVE', metricKey: 'ai_solutions_deployed', metricValue: 12, period: '2025-Q1' },
        { persona: 'EXECUTIVE', metricKey: 'estimated_annual_savings', metricValue: 2400000, period: '2025-Q1' },
        { persona: 'CUSTOMER_SERVICE', metricKey: 'tickets_automated', metricValue: 4230, period: '2025-Q1' },
        { persona: 'CUSTOMER_SERVICE', metricKey: 'hours_saved', metricValue: 1410, period: '2025-Q1' },
        { persona: 'DEVELOPER', metricKey: 'code_reviews_assisted', metricValue: 890, period: '2025-Q1' },
        { persona: 'DEVELOPER', metricKey: 'hours_saved', metricValue: 445, period: '2025-Q1' },
        { persona: 'FINANCE', metricKey: 'reports_generated', metricValue: 67, period: '2025-Q1' },
        { persona: 'FINANCE', metricKey: 'hours_saved', metricValue: 134, period: '2025-Q1' },
        { persona: 'HR', metricKey: 'job_descriptions_created', metricValue: 43, period: '2025-Q1' },
        { persona: 'HR', metricKey: 'screening_hours_saved', metricValue: 215, period: '2025-Q1' },
      ],
      skipDuplicates: true,
    }),
  ])

  console.log('Seed completed successfully.')
  console.log('Demo users created:')
  console.log('  exec@aidemo.com     (Executive)')
  console.log('  po@aidemo.com       (Product Owner)')
  console.log('  ba@aidemo.com       (Business Analyst)')
  console.log('  cs@aidemo.com       (Customer Service)')
  console.log('  hr@aidemo.com       (HR)')
  console.log('  finance@aidemo.com  (Finance)')
  console.log('  legal@aidemo.com    (Legal & Sourcing)')
  console.log('  dev@aidemo.com      (Developer)')
  console.log('  gov@aidemo.com      (Governance)')
  console.log('  Password for all: Demo@2025')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
