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

const renderChart = (labels, data, type) => {
  const ctx = document.getElementById("myChart").getContext("2d");

  // Destroy the existing chart instance if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create a new chart instance
  chartInstance = new Chart(ctx, {
    type: type,
    data: {
      labels: labels, // Correct order: labels are X-axis
      datasets: [
        {
          label: "# of Reviews",
          data: data, // Y-axis values
          backgroundColor: ["#36A2EB", "#FF6384"],
          borderColor: ["#36A2EB", "#FF6384"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const askAi = async (reviewJson) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("reviewJSON", JSON.stringify(reviewJson));

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };
    

    const response = await fetch(
      "http://localhost:3000/aksAI/",
      requestOptions
    );
    const aiResponse = await response.text();
    document.querySelector(".aires").innerHTML = aiResponse;
    document.querySelector(".aires").style.color = "white";
    const airesDiv = document.querySelector(".aires"); // Select the parent div
    const targetDiv = airesDiv.querySelector("div"); // Find the desired div

    if (targetDiv) {
      airesDiv.innerHTML = ""; // Clear all content inside .aires
      airesDiv.appendChild(targetDiv); // Append only the target div
    }
  } catch (error) {}
};

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

      // Process review data for charting
      const reviewData = review.map((e) => ({
        created: e.created || "Unknown", // Fallback for missing `created` field
      }));

      const reviewCounts = reviewData.reduce((acc, review) => {
        const time = review.created;
        acc[time] = (acc[time] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(reviewCounts); // X-axis: e.g., "4 months ago"
      const data = Object.values(reviewCounts); // Y-axis: e.g., counts of each time

      // Render the bar chart
      const type = "bar";
      renderChart(labels, data, type);

      const jsonViewerContainer = document.querySelector("#json-viewer");
      jsonViewerContainer.innerHTML = ""; // Clear previous JSON viewer content
      new JsonViewer({
        theme: "dark",
        value: review.map((elem) => ({
          ...elem,
          images: elem.images.length,
        })),
      }).render(jsonViewerContainer);
      const interval = setInterval(async () => {
        const icon = document.querySelector(".MuiSvgIcon-root");

        if (icon && icon.parentElement) {
          icon.parentElement.click();
          clearInterval(interval); // Stop checking after finding the icon

          const aiJSON = review.map((elem) => ({
            ...elem,
            images: elem.images.length,
          }));

          try {
            const res = await askAi(aiJSON);
          } catch (error) {
            console.error("Error calling askAi:", error);
          }
        }
      }, 100);

      document.querySelector(
        "#productName"
      ).textContent = `Product: ${productName}`;
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing the data. Please try again.");
    }
  });
});
