import React from 'react';
import '../App.css';
import pic1 from "../assets/pic1.jpg";
import pic2 from "../assets/pic2.jpg";
import pic3 from "../assets/pic3.jpg";
import pic4 from "../assets/pic4.jpg";
import pic5 from "../assets/pic5.jpg";
import pic6 from "../assets/pic6.jpg";
import pic7 from "../assets/pic7.jpg";
import pic8 from "../assets/pic8.jpg";
import pic9 from "../assets/pic9.jpg";
import pic10 from "../assets/pic10.jpg";
import pic11 from "../assets/pic11.jpg";
import pic12 from "../assets/pic12.jpg";
import pic13 from "../assets/pic13.jpg";
import pic14 from "../assets/pic14.jpg";
import pic15 from "../assets/pic15.jpg";
import pic16 from "../assets/pic16.jpg";
import pic17 from "../assets/pic17.jpg";
import pic19 from "../assets/pic19.jpg";
import pic20 from "../assets/pic20.jpg";
import pic21 from "../assets/pic21.jpg";
import pic22 from "../assets/pic22.jpg";
import pic23 from "../assets/pic23.jpg";
import image1 from "../assets/image1.jpeg";
import image2 from "../assets/image2.jpeg";


export default function EventGallery() {
  const images = [
    { id: 1, src:pic1, class: "" },
    { id: 2, src:pic2, class: "tall" }, 
    { id: 3, src: pic3, class: "" },
    { id: 4, src: pic4, class: "wide" },
    {id:5,src:pic5,class:""},
    {id:6,src:pic6,class:""},
     { id: 7, src:pic7, class: "" },
    { id: 8, src:pic8, class: "tall" }, 
    { id: 9, src: pic9, class: "" },
    { id: 10, src: pic10, class: "wide" },
    {id:11,src:pic11,class:""},
    {id:12,src:pic12,class:""},
     { id: 13, src:pic13, class: "" },
    { id: 14, src:pic14, class: "tall" }, 
    { id: 15, src: pic15, class: "" },
    {id:16,src:pic16,class:""},
    {id:17,src:pic17,class:""},
     { id: 19, src:pic19, class: "" },
    { id: 20, src:pic20, class: "tall" }, 
    { id: 21, src: pic21, class: "" },
    {id:22,src:pic22,class:""},
    {id:23,src:pic23,class:""},
    {id:24,src:image1,class:""},
    {id:25,src:image2,class:""},
    

    
    
    
    


  
  ];

  return (
    <div className="gallery-container">
      <h2 className="gallery-title">Our Captured Moments</h2>
      <div className="masonry-wrapper">
        {images.map((img) => (
          <div key={img.id} className={`gallery-item ${img.class}`}>
            <img src={img.src} alt="Event" />
            <div className="overlay">
          
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}