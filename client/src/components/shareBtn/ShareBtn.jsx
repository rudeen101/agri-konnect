import React, { useState, useContext } from "react";
import "./shareBtn.css"; // Import CSS for styling
import {IconButton, Tooltip } from '@mui/material';

import ShareIcon from '@mui/icons-material/Share';

import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    WhatsappIcon
  } from 'react-share';



const ShareBtn = ({ productData }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);

    return (
        <div  
            className="share-button-container"
            onMouseEnter={() => setShowShareOptions(true)}
            onMouseLeave={() => setShowShareOptions(false)}
        >
            <Tooltip title="" arrow>
                <IconButton className="share-button tooltipIcon">
                    <ShareIcon className='icon' />
                </IconButton>
            </Tooltip> 

            {showShareOptions && (
                <div className="share-options">
                    <div>
                        <FacebookShareButton 
                            url="https://www.example.com/product/12345"
                            quote={productData?.name}
                            hashtag="#AgriKonnect"
                        >
                            <FacebookIcon size={25} round />
                        </FacebookShareButton>
                    </div>
                    
                    <div className="mt-2">
                        <WhatsappShareButton 
                            url="https://www.example.com/product/12345"
                            title="Check out this amazing product!"
                            separator=" - "
                        >
                            <WhatsappIcon size={25} round />
                        </WhatsappShareButton>
                    </div>
                
                </div>

            )}
        
        </div>
    );
};

export default ShareBtn;
