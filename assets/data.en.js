/* English version of the tracks, stages and fees (from the "website model" file).
   Fees here are for display only; the real amount is set by the server.
   Stage ids and fees must match assets/data.js (scripts/check.js verifies this). */
const TRACKS = [
 { id:'startup', name:'Emerging Projects', tag:'Consulting, awareness and oversight of execution',
   intro:'We help you move from an idea to a project that can be studied and executed, step by step, with a focus on choosing the right project and avoiding early losses.',
   points:[
     'Consulting based on accumulated experience and an understanding of market needs and your own needs. We analyze your capabilities and your position in the project, then give you the right opinion and the options available so you can make a better decision.',
     'Simplified information and experience that help you understand your decisions before entering a project or a financial or operational commitment.'],
   stages:[
    {id:'s1', name:'Registration, project assessment and awareness consultation', fee:1000,
     alt:{fee:2000, label:'An idea or project suggested by Masar'},
     items:['Registering your details','A preliminary study of your project, if you have one in mind','Understanding the capital available','An initial assessment of the idea\u2019s quality','Identifying strengths and initial risks','A brief guide to executing the project','If the idea is not suitable: we present three suitable alternatives']},
    {id:'s2', name:'Choosing the project, planning and study to define the path', fee:4000,
     items:['Choosing by your interests if you want to take part in operations, or by market need if you do not','Defining the most suitable path for the project','A deeper study of the project','Defining requirements and costs and studying risks','Drawing up the execution plan','Defining the stages of using the capital','Preparing the initial concept before the actual start','A guide covering the full study together with the consultations provided']},
    {id:'s3', name:'Supervision and follow-up of project execution', fee:null, feeLabel:'As per the signed agreement',
     items:['Supervising execution and continuity according to the agreed plan']}
   ]},
 { id:'develop', name:'Project Development', tag:'Review, analysis and development of an existing project',
   intro:'If you have an existing project and want to improve or develop it, we review its situation, analyze its potential and identify development opportunities, whether in the way of working, costs, execution, products and services, or expansion.',
   points:[
     'We start by understanding the project\u2019s current situation, then review the available information, identify strengths and weaknesses, look for improvement opportunities, and draw up a practical vision of the proposed path.',
     'The aim is not to pump in extra money, but to know what can be improved, what is worth investing in, and what to avoid before making a decision.'],
   scopeList:['Getting to know the project, its activity and current situation','Reviewing the project idea and how it operates','Analyzing the available capabilities','Reviewing costs and execution stages when needed','Identifying strengths and weaknesses','Investigating the causes of declining performance or problems','Identifying development and improvement opportunities','Studying the possibility of expansion or a change of course','Presenting options and solutions according to the project\u2019s situation','Drawing up an initial concept of the development plan','Raising awareness of risks before a decision is made','Using specialists when a technical, engineering, regulatory or legal opinion is needed'],
   stages:[
    {id:'d1', name:'Assessment, review, analysis and identifying development opportunities', fee:3000,
     items:['Getting to know the project, collecting basic information and defining the need','Analyzing the situation and identifying strengths, weaknesses and available opportunities','Setting priorities and the steps that can be started with','A guide and recommendations on what was studied and explained to you']},
    {id:'d2', name:'Development path and an initial concept of the development and execution plan', fee:null, feeLabel:'As per the signed contract',
     items:['Preparing the development path and the procedures that follow from it','An initial concept of the development plan and current market information','Using specialists when engineering, technical, regulatory or legal intervention is needed']},
    {id:'d3', name:'Defining the project path and execution', fee:null, feeLabel:'As per the signed contract',
     items:['Supervising execution by Masar']}
   ]},
 { id:'stalled', name:'Stalled Projects', tag:'Studying the project and diagnosing the causes of the stall',
   intro:'The first step is neither execution nor pumping in extra money, but understanding the problem and identifying the causes of the stall. The aim is not to restart the project at any cost, but to know the cause first and then choose the solution worth basing a decision on.',
   points:[
     'We review the project and its current situation, analyze the available information, look for the causes of the stall, and then reach a clear conclusion that defines the right path for the next stage.'],
   stages:[
    {id:'t1', name:'Studying the project and diagnosing the problem', fee:5000,
     items:['Reviewing the project and its current situation','Collecting information and data related to the project','Reviewing what has been executed and what remains','Analyzing the current situation','Investigating the causes of the stall','Identifying the points of failure affecting the project','Diagnosing the main problem or problems','Setting the priorities that need to be addressed','A brief initial concept of the suitable path after the study']},
    {id:'t2', name:'Solutions, treating the stall and the size of the problem', fee:null, feeLabel:'As per the signed agreement',
     lead:'Depending on the case, this may include:',
     items:['Drawing up a plan to treat the causes of the stall','Rearranging the project stages','Developing or modifying the path','Helping to choose suitable implementers or parties']},
    {id:'t3', name:'Defining the project path and execution', fee:null, feeLabel:'As per the signed contract',
     items:['Supervising execution by Masar']}
   ]},
 { id:'realestate', name:'Real Estate Development', tag:'Engineering consultations, designs, contractors, factories, supplies, requirements and regulations',
   intro:'We help you see the project in an integrated way, understand the options and study the suitable path before entering financial commitments or large costs, whether you are an individual, a project owner or a real estate developer.',
   points:[
     'We provide consulting from our hands-on field experience. When a matter requires a specific specialization or license, we guide you to the best real estate service offices, professional consultancies and competent licensed bodies, and we do not provide every service ourselves.',
     'We help you evaluate ideas, avoid early mistakes and losses, and reach the most suitable path before making a decision.'],
   critical:{title:'Very important', text:'\u201cMasar Projects and Development\u201d does not replace the engineering office and does not practice licensed engineering work in its place. Our role is consulting, awareness and guidance, helping you define your need and choose the suitable office, and following the path and supervising execution as per the signed agreement.'},
   notice:{title:'Important note', text:'Real estate development includes governmental, engineering, technical, regulatory or legal aspects that require the opinion or approval of a competent body. We therefore explain the nature of each piece of information or recommendation, and use specialists and licensed bodies when needed.'},
   scope:[
    {t:'Project study', d:'The idea of the project, its purpose and the required use of the building; reviewing the available capabilities and your requirements; and discussing risks and opportunities and defining the proposed path.'},
    {t:'Project location', d:'Studying the project\u2019s need in terms of location and use and the available options, raising awareness of the factors to consider before buying or developing, and ordering priorities before the decision.'},
    {t:'Design and planning', d:'Reviewing the general design and discussing its needs, drawing on experience in designs and decoration, and coordinating with specialists and engineering bodies. We ask about the design:',
     q:['Does it meet your need?','Are the spaces distributed suitably?','Does it contain anything that causes unnecessary cost?','Are the work stages clear?','Do the specifications suit the budget?','Is there a conflict between your wishes and the budget?','Are there points to ask the engineering office about?']},
    {t:'Contractors and implementers', d:'Understanding the available execution options and reviewing matters related to contractors, drawing on past experience in contracting and finishing. The suitable implementer is evaluated according to the nature and requirements of the project, not on price alone.'},
    {t:'Factories and production workshops', d:'Raising awareness of the available factories and workshops that serve the project, and reviewing manufacturing needs according to the nature of the work.'},
    {t:'Building materials and supplies', d:'Understanding the options and comparing alternatives in quality, use and cost, while verifying information and prices when needed.'},
    {t:'Finishing and decor', d:'Drawing on experience in finishing and decoration work and reviewing the suitable options in quality, cost and execution.'},
    {t:'Execution and follow-up', d:'After the suitable path is defined, services of follow-up, supervision or coordination during the execution stages can be agreed on, according to the nature of the project and the signed agreement.'}
   ],
   flow:['Discussing the project idea','Studying the location and the need','Analyzing options and costs','Defining the suitable path','Using the best three offices for each specialized execution section','Following up the implementers and sticking to the work plan'],
   stages:[
    {id:'r1', name:'Preliminary consultation before construction', fee:2000,
     items:['Defining the purpose of the project or construction','Budget and capital','Regulations and requirements','Studying options and initial costs','Defining the suitable path for the project']},
    {id:'r2', name:'Design, planning and issuing the plans', fee:5000, feeNote:'Does not include the engineering office fees',
     lead:'We guide you and suggest useful additions before the plan is issued, based on field experience.',
     items:['Choosing the suitable engineering office','Architectural plans','Structural plans','Mechanical plans','Air-conditioning plans','Interior design and decor','Reviewing the plans\u2019 fit with your needs and budget']},
    {id:'r3', name:'Licenses and regulatory procedures', fee:2000, feeNote:'Does not include government fees',
     items:['Required licenses','Building requirements','Relevant bodies','Regulatory requirements of the project']},
    {id:'r4', name:'Execution, supervision and follow-up', fee:null, feeLabel:'As per the signed contract',
     lead:'Under the supervision and follow-up of Masar Projects and Development, covering the following execution stages:',
     items:['Choosing the contractor and implementers','Preparation and project start','Earthworks and foundations','Structural frame','Masonry and partitions','Electrical works','Plumbing works','Air conditioning and ventilation','Insulation and protection','Doors, windows and facades','Finishing stage','External finishing','Inspection and handover'], numbered:true}
   ]}
];
