import React from 'react';
import Navigation from '../Navigation/page';
import Footer from '../Footer/footer';

const Contact = () => {
  return (
    <>
      <Navigation />
      <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen">
        <div className="contact-container">
          <div className='contact-item'>
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="30px" viewBox="0 0 384 512">
              <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
            </svg>
            <div>Address : ABC 123456</div>
          </div>
          <div className='contact-item'>
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="30px" viewBox="0 0 512 512">
              <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
            </svg>
            <div>Phone : +91-1234567890</div>
          </div>
          <div className='contact-item'>
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="30px" viewBox="0 0 512 512">
              <path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
            </svg>
            <div>Email : abc@example.com</div>
          </div>
          <div className='contact-item'>
            <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="30px" viewBox="0 0 512 512">
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
            <div>Website : <a href='example.com'>example.com</a></div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Contact;
