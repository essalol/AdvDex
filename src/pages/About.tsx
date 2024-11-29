import { useEffect } from 'react'

const About = () => {
    useEffect(() => {
        document.title = "About | CryptoSwap";
    }, []);
    return (
        <div className='container py-12'>
            <p><text className='text-2xl'>W</text>elcome to <b className='text-[#c7f284]'>CryptoSwap.finance</b>, your trusted platform for seamless, decentralized trading. Built on the principles of transparency, security, and innovation, CryptoSwap empowers users to trade digital assets effortlessly across multiple blockchain networks.</p>
            <br />
            <h1 className='text-[#c7f284] text-2xl font-medium'>Our Mission:</h1>

            <p>At CryptoSwap, our mission is to bridge the gap between users and the world of decentralized finance (DeFi). We aim to make trading easy, efficient, and accessible to everyone, whether you're a seasoned crypto enthusiast or just beginning your DeFi journey.</p>

            <br />
            <p className='text-[#c7f284] text-2xl font-medium'>What We Offer:</p>

            <ul>
                <li><b className='text-[#c7f284]'>Multi-Chain Functionality:</b> Trade assets across leading networks such as Ethereum, Binance Smart Chain, Base, Arbitrum, and more.</li>
                <li><b className='text-[#c7f284]'>User-Centric Experience:</b> Our intuitive interface is designed to provide a smooth trading experience on both desktop and mobile.</li>
                <li><b className='text-[#c7f284]'>Transparency:</ b> Enjoy real-time analytics, including daily trading volumes, top tokens, and transaction histories, ensuring you stay informed.</li>
                <li><b className='text-[#c7f284]'>Low Fees:</b> CryptoSwap is committed to offering competitive fees, so you get the most value out of every transaction.</li>
            </ul>

            <br />
            <h1 className='text-[#c7f284] text-2xl font-medium'>Why Choose CryptoSwap?</h1>

            <p>CryptoSwap stands out by combining cutting-edge technology with a deep commitment to user satisfaction. From secure smart contract infrastructure to responsive customer support, every feature is tailored to enhance your trading experience.</p>
            <br />

            <i className='text-[#c7f284] text-2xl font-medium'>Trade smarter. Trade seamlessly. Trade with CryptoSwap.</i>
        </div>
    )
}

export default About