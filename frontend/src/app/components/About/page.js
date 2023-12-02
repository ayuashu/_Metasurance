"use client";
import React from 'react'
import Footer from '../Footer/footer'
import Navigation from '../Navigation/page'


const About = () => {
  return (
    <>
      <Navigation />
      <div className="bg-slate-700 bg-blend-lighten hover:bg-blend-darken min-h-screen"
        style={{ overflowY: 'hidden', height: '100%', margin: '0', padding: '0' }}>
        <style jsx global>{`html, body { overflow: hidden; height: 100%; margin: 0; padding: 0;}`}</style>
        <h1 style={{ color: 'white', textAlign: 'center', justifyContent: 'center', fontSize: '20px', paddingTop: '200px' }}>
          We are here to provide <b>Inusrance</b> to the users of the <b>Metaverse</b> <br />based on their requirements using the <b>Blockchain Technology</b>,<br /> which further enhances the<br /> <b>trust</b>, <b>security</b>, <b>privacy</b>, <b>transparency</b> <br />and various other features which make us one of <b>the best choice for the users</b>.
        </h1>
      </div>

      <Footer />
    </>
  )
}

export default About
