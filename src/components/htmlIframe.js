import React from 'react';

const HtmlIframe = (props) => {


    return (
        <>
            {props.html_code && props.html_code.length > 0 ?

                <iframe id="iframe" srcdoc={props.html_code.toString()} width="100%" height="600"></iframe>
                :

                <>
                    <h1 className='text-danger text-center'>No Bureau document found.</h1>
                </>

            }
        </>

    )
}

export default HtmlIframe