const footerYear = function () {
  const span = document.getElementById("year");
  if (span) span.innerText = new Date().getFullYear();
};

const myEcommerceURL = "https://striveschool-api.herokuapp.com/api/product/";

const getmyEcommerce = function () {
  fetch(myEcommerceURL, {
    method: "GET",
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWUxZGY5MzczOWY4NzAwMTU3YWIwODUiLCJpYXQiOjE3NzY0MTA1MTUsImV4cCI6MTc3NzYyMDExNX0.lqS5N5fgyQeDZtZGj9410pzXNU75Ov-dmLkoLsueWTc",
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Response not ok");
      }
    })
    .then((data) => {
      const spinner = document.getElementById("spinner-section");
      if (spinner) spinner.classList.add("d-none");

      console.log("Prodotti ricevuti:", data);

      const container = document.getElementById("card-product");

      data.forEach((product) => {
        const newCard = document.createElement("div");
        newCard.innerHTML = `
            <div class="card w-25">
              <img src="${product.imageUrl}" class="card-img-top w-50" alt="${product.name}" />
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.brand}</p>
                <p class="card-text"><strong>${product.price}€</strong></p>
                <a href="./details.html?id=${product._id}" class="btn btn-primary">Product description</a>
              </div>
            </div>
            `;
        container.appendChild(newCard);
      });
    })
    .catch((err) => {
      console.error("Errore durante la fetch:", err);
    });
};

footerYear();
getmyEcommerce();
