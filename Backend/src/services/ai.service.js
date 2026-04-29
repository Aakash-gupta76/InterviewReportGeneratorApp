// const { GoogleGenAI, Behavior } = require('@google/genai');

// const { z } = require('zod');
// const { zodToJsonSchema } = require('zod-to-json-schema');
// const puppeteer = require('puppeteer');

// const ai = new GoogleGenAI({
//     apiKey: process.env.GOOGLE_API_KEY,
// })

// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 t0 100 indicationg how well the candidate's profile matches the job description"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question asked in the interview"),
//         intension: z.string().describe("The intension of the interviewer behind asking the questions"),

//         answer: z.string().describe("How to answer this questions what points to cover ,what approach to take etc ")
//     })).describe('technical questions that are asked in the interview along with their intention and how to answer them '),
//     behaviorQuestions: z.array(z.object({
//         question: z.string().describe("The behavioral question asked in the interview"),
//         intension: z.string().describe("The intension of the interviewer behind asking the questions"),
//         answer: z.string().describe("How to answer this questions what points to cover ,what approach to take etc ")
//     })).describe('behaviour questions that are asked in the interview  '),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe('The skill that the candidate is lacking based on the job descriptioon and the candidate profile'),
//         severity: z.enum(["low", "medium", "high"]).describe('The serverity of the skill gap indicating how critical it is for the candidate to address'),

//     })),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe('The day number in the preparation plan'),
//         focus: z.string().describe("the main focus of this day in the prepatation plan,starting from 1"),
//         tasks: z.array(z.string()).describe("List of the tasks   to be done on theis day to follow the preparaton plan for example read a specific books like this ")
//     })).describe("A day-wise preparation plan for the candidate to follow in for interview"),

// })
// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
//     const prompt = `Generate an interview report for the candidate with the following details:
// Resume:${resume}
// self Description:${selfDescription}
// job Description :${jobDescription}
// `

//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(interviewReportSchema)
//         }
//     })

//     console.log(JSON.parse(response.text));
//     return JSON.parse(response.text)



// }
// async function generatePdfFromHtml(htmlContent){
//     const browser=await puppeteer.launch();
//     const page=await browser.newPage()
//     await page.setContent(htmlContent,{waitUntil:'networkidle0'})
//     const pdfBuffer=await page.pdf({format:'A4'})
//     await browser.close();
//     return pdfBuffer;
// }

// async function generateResumePdf({
//     resume, selfDescription, jobDescription
// }) {

//     const resumePdfSchema=z.object({
//         html:z.string().describe('The Html content of the resume which can be converted into pdf  using any library like puppeteer'),


//     })
//     const prompt=`Generate a resume for the candidate with the following details:
// Resume:${resume}
// Self Description:${selfDescription}
// Job Description:${jobDescription}
// the resume should jSON formet  be in html formet and should be ATS friendly and should be optimized for the job description provided
// `
// const response=await ai.models.generateContent({
//     model:"gemini-3-flash-preview",
//     contents:prompt,
//     config:{
//         responseMimeType:"application/json",
//         responseSchema:zodToJsonSchema(resumePdfSchema)
//     }
// })
// const jsonContent= JSON.parse(response.text)
// const pdfBuffer=await generatePdfFromHtml(jsonContent.html)
// return pdfBuffer;

// }

// module.exports ={ generateInterviewReport, generateResumePdf };




const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `
Generate a detailed interview report in STRICT JSON format.

IMPORTANT:
- Do NOT leave any array empty
- MUST include a matchScore (0-100) - evaluate how well the candidate's resume and skills match the job description
- Generate at least:
  - 5 technical questions
  - 3 behavioral questions
  - 3 skill gaps
  - 5-day preparation plan

Each technical and behavioral question MUST include:
- question
- intention
- answer

Return ONLY valid JSON.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`

        const exampleJson = {
            title: "Senior React Developer",
            matchScore: 85,
            candidateSummary: "Example summary...",
            technicalQuestions: [{ question: "Q1", intention: "I1", answer: "A1" }],
            behavioralQuestions: [{ question: "Q1", intention: "I1", answer: "A1" }],
            skillGaps: [{ skill: "React Hooks", severity: "medium" }],
            preparationPlan: [{ day: 1, focus: "React", tasks: ["Task 1", "Task 2"] }]
        }

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt + `\n\nIMPORTANT: 
- Use camelCase for all keys
- matchScore is REQUIRED (must be a number between 0-100)
- Use the exact structure from this example: ${JSON.stringify(exampleJson)}
- Calculate matchScore based on how well the candidate's skills and experience match the job requirements`,
            config: {
                responseMimeType: "application/json",
            }
        })

        let text = ""
        if (typeof response.text === 'function') {
            text = response.text()
        } else if (typeof response.text === 'string') {
            text = response.text
        } else if (response.candidates && response.candidates[0].content.parts[0].text) {
            text = response.candidates[0].content.parts[0].text
        }
        
        const result = JSON.parse(text)
        
        // Ensure matchScore is a valid number
        let matchScore = parseInt(result.matchScore || result.match_score || 50);
        matchScore = isNaN(matchScore) ? 50 : Math.min(100, Math.max(0, matchScore));
        
        // Fallback mapping for snake_case
        return {
            title: result.title || result.jobTitle || result.job_title || "Interview Plan",
            matchScore: matchScore,
            candidateSummary: result.candidateSummary || result.candidate_summary || "",
            technicalQuestions: result.technicalQuestions || result.technical_questions || [],
            behavioralQuestions: result.behavioralQuestions || result.behavioral_questions || [],
            skillGaps: result.skillGaps || result.skill_gaps || [],
            preparationPlan: result.preparationPlan || result.preparation_plan || []
        }
    } catch (error) {
        console.error("AI Service Error:", error.message || error);
        
        // Check if it's a rate limit or availability error
        if (error.message && (error.message.includes("503") || error.message.includes("UNAVAILABLE") || error.message.includes("high demand"))) {
            throw new Error("The AI model is currently overloaded. Please try again in a few moments.");
        }
        
        throw new Error(`Failed to generate interview report: ${error.message || "Unknown error occurred"}`);
    }
}




async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    })
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt + "\nIMPORTANT: Use camelCase for all JSON keys exactly as specified in the schema. Return exactly { \"html\": \"...\" }.",
        config: {
            responseMimeType: "application/json",
        }
    })

    let text = ""
    if (typeof response.text === 'function') {
        text = response.text()
    } else if (typeof response.text === 'string') {
        text = response.text
    } else if (response.candidates && response.candidates[0].content.parts[0].text) {
        text = response.candidates[0].content.parts[0].text
    }

    const jsonContent = JSON.parse(text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf }