import apiClient from "./services";

export default {
  // get all reviews for a resumes
  getReviews(resumeId) {
    return apiClient.get(`reviews/${resumeId}` );
},

// add review to a story

addReview(review) {
    return apiClient.post("reviews/", review);
},

// update review for a story

updateReview(review) {
    console.log("BEFORE UPDATE "+review.id)
    return apiClient.put("reviews/" + review.id, review);
},

// delete review for a story

deleteReview(reviewId) {
    return apiClient.delete("reviews/" +  reviewId);
}

}