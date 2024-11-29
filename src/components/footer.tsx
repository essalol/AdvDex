import { Link } from "react-router-dom";

const Footer = () => (
    <footer className="bg-[#2a2c3480] lg:flex text-white text-center space-y-2" style={{ padding: '20px' }}>
        <div>
        <div className="flex lg:justify-start items-center lg:ml-20 justify-center">
            <img src='/cryptoswap.png' className="inline-block w-auto h-10"></img>
            <h2 className="text-center text-2xl">
                &nbsp;CryptoSwap
            </h2>
        </div>
        <p className="text-[#757985] flex lg:justify-start lg:ml-20 justify-center">© 2024 CryptoSwap. All rights reserved.</p>
        </div>

        <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
        <ul className="inline-block">
            <li style={{ display: 'inline', marginRight: '15px' }}>
                <Link to="/about" className="hover:text-[#c7f284]" >About Us</Link>
            </li>
            <li style={{ display: 'inline' }}>
                <Link to="/report" className="hover:text-[#c7f284]" >Report an Issue</Link>
            </li>
        </ul>
        <div className="flex text-[#757985] items-center justify-center">
            <p>Made with</p>
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" className="svg-inline--fa fa-heart text-red-600 mx-1 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path></svg>
            <p>by the CryptoSwap team</p>
        </div>
        </div>
    </footer>
);

export default Footer;
