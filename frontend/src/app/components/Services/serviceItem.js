import React from 'react'

const ServiceItem = ({itemData}) => {
  return (
    <>
      <div className="main-card--cointainer">
        {itemData.map((curElem) => {
          const { id, name, category, image, description, plans } = curElem;

          return (
            <>
              <div className="card-container" key={id}>
                <div className="card">
                  <div className="card-body">
                    <span className="card-number card-circle subtle">{id}</span>
                    <span className="card-author subtle"> {category}</span>
                    <h2 className="card-title"> {name} </h2>
                    <span className="card-description subtle">
                      {description}
                    </span>
                  </div>
                  <div>
                    <img src={image} alt="images" className="card-media shadow-lg" />
                    <span className="card-tag  subtle">Plans</span>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  )
}

export default ServiceItem
