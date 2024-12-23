const fetchProductReviews = async (productLink) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("link", productLink);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    const response = await fetch(
      "http://localhost:3000/review/",
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return { review: result.reviews, productName: result.productName };
  } catch (error) {
    console.error("Error fetching product reviews:", error.message);
    return { review: null, productName: null };
  }
};
const insertProductlink = async (productLink) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("link", productLink);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    const response = await fetch(
      "http://localhost:3000/storeLink/",
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching product reviews:", error.message);
    return { review: null, productName: null };
  }
};

let chartInstance;

document.addEventListener("DOMContentLoaded", () => {


  // Add click event to analyze button
  document.querySelector("#btn-analyse").addEventListener("click", async () => {
    const productLink = document.querySelector("#linkBox").value;

    // Validate input
    if (!productLink.trim()) {
      alert("Please enter a valid product link.");
      return;
    }

    try {
      // Fetch product reviews
      const { review, productName } = await fetchProductReviews(productLink);

      // Handle cases where review or productName is missing
      if (!review || !productName) {
        alert("Failed to fetch reviews or product name. Please try again.");
        return;
      }


      const jsonViewerContainer = document.querySelector("#json-viewer");
      jsonViewerContainer.innerHTML = ""; // Clear previous JSON viewer content
      new JsonViewer({
        theme: "dark",
        value: review,
      }).render(jsonViewerContainer);


      document.querySelector(
        "#productName"
      ).textContent = `Product: ${productName}`;
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the data. Please try again.");
    }
  });
});
