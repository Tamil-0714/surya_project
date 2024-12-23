const axios = require("axios");
function convertToReviewUrl(fullUrl) {
  try {
    const url = new URL(fullUrl);
    const pathnameParts = url.pathname.split("/");

    const pid = url.searchParams.get("pid");
    const lid = url.searchParams.get("lid");
    const marketplace = url.searchParams.get("marketplace") || "FLIPKART";

    if (!pid || !lid) {
      throw new Error("Missing required parameters: 'pid' or 'lid'");
    }

    const reviewPath = `/${pathnameParts[1]}/product-reviews/${pid}?pid=${pid}&lid=${lid}&marketplace=${marketplace}`;
    return reviewPath;
  } catch (error) {
    console.error("Error converting URL:", error.message);
    return null;
  }
}
const fetchReiviewsPagination = async (
  actualUrl,
  pageCount,
  apiURL,
  headers,
  delayMs = 1000 // Default delay of 1 second between requests
) => {
  const paginationReview = [];
  for (let i = 2; i <= 20; i++) {
    const pageURL = `${actualUrl}&page=${i}`;
    const body = {
      pageUri: pageURL,
      pageContext: { fetchSeoData: true },
    };

    try {
      const res = await axios.post(apiURL, body, { headers });
      const reviewsWidget = res?.data?.RESPONSE?.slots?.filter(
        (slot) => slot?.widget?.type === "REVIEWS"
      );

      if (reviewsWidget?.length > 0) {
        const allReviews = reviewsWidget.flatMap((slot) =>
          slot.widget.data.renderableComponents.map((review) => ({
            author: review?.value?.author,
            rating: review?.value?.rating,
            title: review?.value?.title,
            created: review?.value?.created,
            text: review?.value?.text,
            helpfulCount: review?.value?.helpfulCount,
            images: review?.value?.images || [],
          }))
        );
        console.log(`page count : ${i}`);
        paginationReview.push(allReviews);

        // Process or store reviews as needed here.
      } else {
        console.error(`page not found count : ${i}`);
      }
    } catch (error) {
      console.error(`Error on page ${i}:`, error.message);
    }

    // Add delay to avoid hitting rate limits
    // if (i < pageCount) {
    //   await delay(delayMs);
    // }
  }
  return paginationReview.flat();
};
const fetchReiviews = async (actualUrl) => {
  const url = "https://2.rome.api.flipkart.com/api/4/page/fetch";
  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9,ta;q=0.8",
    "content-type": "application/json",
    "sec-ch-ua":
      '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 FKUA/website/42/website/Desktop",
    Referer: "https://www.flipkart.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };
  const newUrl = convertToReviewUrl(actualUrl);
  const productName = newUrl.split("/")[1];

  const body = {
    pageUri: newUrl,
    pageContext: { fetchSeoData: true },
  };
  try {
    const res = await axios.post(url, body, { headers });

    const reviewsWidget = res?.data?.RESPONSE?.slots?.filter(
      (slot) => slot?.widget?.type === "REVIEWS"
    );
    const paginationWidget = res?.data?.RESPONSE?.slots?.filter(
      (slot) => slot?.widget?.type === "PAGINATION_BAR"
    );

    const totalPages = paginationWidget[0].widget.data.totalPages;

    const finalPaginationResult = await fetchReiviewsPagination(
      newUrl,
      totalPages,
      url,
      headers
    );

    if (reviewsWidget?.length > 0) {
      const allReviews = reviewsWidget.flatMap((slot) =>
        slot.widget.data.renderableComponents.map((review) => ({
          author: review?.value?.author,
          rating: review?.value?.rating,
          title: review?.value?.title,
          created: review?.value?.created,
          text: review?.value?.text,
          helpfulCount: review?.value?.helpfulCount,
          images: review?.value?.images || [],
        }))
      );
      console.log(`length of all reiews : ${allReviews.length}`);
      console.log(`length of remainng : ${finalPaginationResult.length}`);

      return {
        reviews: [allReviews, finalPaginationResult].flat(),
        productName: productName,
      };
    } else {
      console.error("Reviews widget not found!");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {  
  fetchReiviews,
};
