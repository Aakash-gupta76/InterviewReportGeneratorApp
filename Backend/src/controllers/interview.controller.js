// const pdfparse=require("pdf-parse");

// const interviewReportModel=require("../models/interviewReport.model");
// const {generateInterviewReport,generateResumePdf}=require('../services/ai.service'); 

// async function generateInterviewReportController(req,res){
//     // const resumeFile=req.file
//     const resumeContent= await ( new pdfparse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
//     // const data=await pdfparse(req.file.buffer);
//     // const resumeContent=data.text;

//     const {selfDescription,jobDescription}=req.body;


//     const interviewReportByAI=await generateInterviewReport({
//         resume:resumeContent.text,
//         selfDescription,
//         jobDescription
// })


//     const interviewReport=await interviewReportModel.create({
//         user:req.user._id,
//         resume:resumeContent.text,
//         selfDescription,
//         jobDescription,
//         ...interviewReportByAI

//     })
//     res.status(201).json({
//         message:"Interview report generated sucessfully",
//         interviewReport
//     })

// }
// async function generateResumePdfController(req,res){
//     const {interviewReportId}=req.params
//     const interviewReport=await interviewReportModel.findById(interviewReportId);
//     if(!interviewReportId){
//         return res.status(404).json({
//             message:"Interview report not found",
//         })
//     }
//     const{resume,selfDescription,jobDescription}=interviewReport;
//     const pdfBuffer=await generateResumePdf({
//         resume,
//         selfDescription,jobDescription

//     })
//     res.set({
//         "content-Type":"application/pdf",
//         "content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`,
        
        

//     })
//     res.send(pdfBuffer);

// }





// module.exports={generateInterviewReportController,generateResumePdfController}
// const pdfparse = require('pdf-parse');
// const interviewReportModel = require('../models/interviewReport.model');
// const generateInterviewReport = require('../services/ai.service');

// async function generateInterviewReportController(req, res) {
//     try {
//         // 1. PDF Parse karein (Bina 'new' ke)
//         const data = await pdfparse(req.file.buffer);
//         const resumeContent = data.text;

//         // 2. Body se data nikaalein (Spelling check karein)
//         const { selfDescription, jobDescription } = req.body;

//         // 3. AI Service call karein
//         const interviewReportByAI = await generateInterviewReport({
//             resume: resumeContent,
//             selfDescription,
//             jobDescription
//         });

//         // 4. Database mein save karein
//         const interviewReport = await interviewReportModel.create({
//             user: req.user._id, // req.uer._id ki spelling theek ki
//             resume: resumeContent,
//             selfDescription,
//             jobDescription,
//             ...interviewReportByAI
//         });

//         res.status(201).json({
//             message: "Interview report generated successfully",
//             interviewReport
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: err.message });
//     }
// }

// module.exports = { generateInterviewReportController }




// const pdfParse = require("pdf-parse")
// const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
// const interviewReportModel = require("../models/interviewReport.model")




// /**
//  * @description Controller to generate interview report based on user self description, resume and job description.
//  */
// async function generateInterViewReportController(req, res) {

//     const parsedPdf = await pdfParse(req.file.buffer)
//     const resumeText = parsedPdf.text
//     const { selfDescription, jobDescription } = req.body

//     const interViewReportByAi = await generateInterviewReport({
//         resume: resumeText,
//         selfDescription,
//         jobDescription
//     })

//     const interviewReport = await interviewReportModel.create({
//         user: req.user.id,
//         resume: resumeText,
//         selfDescription,
//         jobDescription,
//         ...interViewReportByAi
//     })

//     res.status(201).json({
//         message: "Interview report generated successfully.",
//         interviewReport
//     })

// }

// /**
//  * @description Controller to get interview report by interviewId.
//  */
// async function getInterviewReportByIdController(req, res) {

//     const { interviewId } = req.params

//     const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

//     if (!interviewReport) {
//         return res.status(404).json({
//             message: "Interview report not found."
//         })
//     }

//     res.status(200).json({
//         message: "Interview report fetched successfully.",
//         interviewReport
//     })
// }


// /** 
//  * @description Controller to get all interview reports of logged in user.
//  */
// async function getAllInterviewReportsController(req, res) {
//     const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

//     res.status(200).json({
//         message: "Interview reports fetched successfully.",
//         interviewReports
//     })
// }


// /**
//  * @description Controller to generate resume PDF based on user self description, resume and job description.
//  */
// async function generateResumePdfController(req, res) {
//     const { interviewReportId } = req.params

//     const interviewReport = await interviewReportModel.findById(interviewReportId)

//     if (!interviewReport) {
//         return res.status(404).json({
//             message: "Interview report not found."
//         })
//     }

//     const { resume, jobDescription, selfDescription } = interviewReport

//     const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

//     res.set({
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
//     })

//     res.send(pdfBuffer)
// }

// module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }







// new code



const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = ""
        if (req.file) {
            try {
                const pdfParseFunc = pdfParse.default || pdfParse
                const data = await pdfParseFunc(req.file.buffer)
                resumeText = data.text
            } catch (error) {
                console.error("PDF Parsing Error:", error)
                // If parsing fails, we continue with empty resumeText
            }
        }
        const { selfDescription, jobDescription } = req.body

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required."
            })
        }

        if (!resumeText && !selfDescription) {
            return res.status(400).json({
                message: "Either resume or self description is required."
            })
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Error generating interview report:", error)
        res.status(500).json({
            message: error.message || "Failed to generate interview report. Please try again later."
        })
    }

}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    console.log("Generated PDF Buffer size:", pdfBuffer.length)
    if (!pdfBuffer || pdfBuffer.length < 100) {
        console.error("Invalid PDF buffer generated.")
        return res.status(500).json({ message: "Failed to generate a valid PDF resume." })
    }

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
        "Content-Length": pdfBuffer.length
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }