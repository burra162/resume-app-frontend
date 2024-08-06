<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import ReviewServices from "../services/ReviewService.js";

const props = defineProps({
  resumeId: {
    type: Number,
    required: true,
  },
});

const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const reviews = ref([]); // Renamed to lowercase for consistency
const user = ref({});
const review = ref({ review: "" }); // Renamed to lowercase
const dialog = ref(false);
const addDialog = ref(false);
const selectedReview = ref({});

onMounted(() => {
  // Check if the user is logged in
  const storedUser = localStorage.getItem("user");
  if (storedUser !== null) {
    user.value = JSON.parse(storedUser);
  } else {
    router.push({ name: "login" });
  }

  // Fetch reviews for the given resumeId
  getReviewsByResumeId();
});

// Watch for changes in resumeId and refetch reviews
watch(
  () => props.resumeId,
  (newResumeId, oldResumeId) => {
    console.log(`Resume ID changed from ${oldResumeId} to ${newResumeId}`);
    getReviewsByResumeId();
  }
);

// Fetch reviews for the specific resumeId
async function getReviewsByResumeId() {
  console.log("Props:", props);
  console.log("Resume ID in review component:", props.resumeId);
  try {
    const response = await ReviewServices.getReviews(props.resumeId);
    reviews.value = response.data.slice().sort((a, b) => b.id - a.id);
  } catch (e) {
    console.error("Error fetching reviews:", e);
  }
}

// Create a new review
async function createReview() {
  if (review.value.review === "") {
    showSnackbar("Please fill in the review field", "red");
    return;
  }

  review.value.userId = user.value.id;
  review.value.resumeId = props.resumeId;

  try {
    await ReviewServices.addReview(review.value);
    getReviewsByResumeId();
    showSnackbar("Review created successfully", "green");

    review.value.review = "";
    addDialog.value = false;
  } catch (e) {
    showSnackbar("Error creating review", "red");
    console.error("Error creating review:", e);
  }
}

// Update an existing review
async function updateReview() {
  if (selectedReview.value.review === "") {
    showSnackbar("Please fill in the review field", "red");
    return;
  }

  try {
    await ReviewServices.updateReview(selectedReview.value);
    getReviewsByResumeId();
    showSnackbar("Review updated successfully", "green");

    selectedReview.value = {};
    dialog.value = false;
  } catch (e) {
    showSnackbar("Error updating review", "red");
    console.error("Error updating review:", e);
  }
}

// Delete a review
async function onDeleteReview(review) {
  if (!confirm("Are you sure you want to delete this review?")) {
    return;
  }

  try {
    await ReviewServices.deleteReview(review.id);
    getReviewsByResumeId();
    showSnackbar("Review deleted successfully", "green");
  } catch (e) {
    showSnackbar("Error deleting review", "red");
    console.error("Error deleting review:", e);
  }
}

// Helper functions
function openEditDialog(review) {
  selectedReview.value = review;
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
}

function closeAddDialog() {
  addDialog.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

function openAddDialog() {
  addDialog.value = true;
}

function showSnackbar(message, color) {
  snackbar.value.color = color;
  snackbar.value.text = message;
  snackbar.value.value = true;
}

function formatDate(date, format = "MM/YYYY") {
  const d = new Date(date);

  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const year = d.getFullYear();

  if (format === "MM/YYYY") {
    return `${month}/${year}`;
  } else if (format === "MM/DD/YYYY") {
    return `${month}/${day}/${year}`;
  } else {
    throw new Error("Unsupported format");
  }
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-container>
          <v-card-title class="headline mb-2">Reviews</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="user.type=== 'admin'" color="primary" variant="flat" @click="openAddDialog">Add Review</v-btn>
          </v-card-actions>
          <div v-if="reviews.length === 0">
            <v-alert type="info" class="mb-2">
              No review records found. Please add your review details.
            </v-alert>
          </div>
          <div v-for="(review, index) in reviews" :key="review.id">
            <v-card class="mb-2 pa-4 stylish-card">
              <v-row>
                <v-col cols="10">
                  <div class="review-description">{{ review.review }}</div>
                  <v-spacer></v-spacer>
                  <div class="review-small-description"  >Posted on {{ formatDate(review.createdAt,'MM/DD/YYYY') }}</div>
                </v-col>
                <v-col cols="2" class="text-right" v-if="user.type=== 'admin'">
                  <v-btn size="small" icon class="mx-2" @click="openEditDialog(review)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn size="small" icon @click="onDeleteReview(review)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-container>
      </v-col>
    </v-row>

    <!-- Add Review Dialog -->
    <v-dialog v-model="addDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Add Review</v-card-title>
        <v-card-text>
          <v-textarea v-model="review.review" label="Review" required></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" @click="closeAddDialog">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="createReview">Create Review</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Review Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">Edit Review</v-card-title>
        <v-card-text>
          <v-textarea v-model="selectedReview.review" label="Review" required></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" @click="closeDialog">Cancel</v-btn>
          <v-btn variant="flat" color="primary" @click="updateReview">Update Review</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "AdminReviews",
};
</script>

<style>
.stylish-card {
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.stylish-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
.review-description {
  font-size: 14px;
  color: #424242;
}
.review-small-description {
  font-size: 12px;
  color: #424242;
}
</style>
