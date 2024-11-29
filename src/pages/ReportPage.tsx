import { useEffect } from "react";

const ReportPage = () => {
    useEffect(() => {
        document.title = "Report an issue | CryptoSwap";
    })
    return (
        <div className="container py-12">
            <p><text className="text-2xl">A</text>t <b className="text-[#c7f284]">CryptoSwap.finance</b>, we value your feedback and are committed to ensuring a smooth and reliable experience for all users. If you've encountered a problem or have concerns about our platform, we're here to help.</p>
            <br />

            <h1 className="text-[#c7f284] text-2xl font-medium">How to Report an Issue:</h1>

            <ul>
                <li><b className="text-[#c7f284]">Describe the Issue Clearly:</b> Provide a detailed description of the problem, including what you were doing when it occurred.</li>
                <li><b className="text-[#c7f284]">Include Relevant Details:</b> Share any transaction IDs, error messages, or screenshots that might help us investigate the issue effectively.</li>
                <li><b className="text-[#c7f284]">Provide Contact Information:</b> Ensure your email address is correct so we can follow up with you if needed.</li>
            </ul>

            <br />
            <h1 className="text-[#c7f284] text-2xl font-medium">Submit Your Report:</h1>
            <p>Please use the email below to submit your issue. Our team will review your report and get back to you as soon as possible.</p>

            <br />
            <p>If you require immediate assistance, please contact us at <a href="mailto:support@cryptoswap.finance" className="text-[#c7f284]">support@cryptoswap.finance</a>.</p>
            <br />
            <p>Thank you for helping us improve CryptoSwap.</p>
        </div>
    )
}

export default ReportPage