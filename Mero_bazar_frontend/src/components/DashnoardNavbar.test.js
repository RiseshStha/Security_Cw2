// import { render, fireEvent, waitFor, screen } from "@testing-library/react";
// import { BrowserRouter as Router } from "react-router-dom";
// import DashboardNavbar from "../components/DashboardNavbar";
// import { searchApi } from "../apis/Api";

// // Mock the API module
// jest.mock("../apis/Api");

// // Helper function to mock window.location.href
// const setWindowLocation = (href) => {
//   delete window.location;
//   window.location = { href };
// };


// describe("DashboardNavbar Component", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should display search results on successful search", async () => {
//     const mockResponse = {
//       data: {
//         success: true,
//         products: [
//           { id: "1", title: "Product 1" },
//           { id: "2", title: "Product 2" },
//         ],
//       },
//     };

//     // Mock the searchApi function
//     searchApi.mockResolvedValue(mockResponse);

//     // Render the component
//     render(
//       <Router>
//         <DashboardNavbar />
//       </Router>
//     );

//     // Find and fill the search input
//     const searchInput = screen.getByPlaceholderText("Search");
//     fireEvent.change(searchInput, { target: { value: "Product" } });

//     // Find and click the search button
//     const searchButton = screen.getByText("Search");
//     fireEvent.click(searchButton);

//     // Wait for the results to be displayed
//     await waitFor(() => {
//       expect(searchApi).toHaveBeenCalledWith({
//         params: {
//           search: "Product",
//           page: 1,
//           limit: 10,
//           sort: "createdAt,asc",
//         },
//       });

//       expect(screen.getByText("Product 1")).toBeInTheDocument();
//       expect(screen.getByText("Product 2")).toBeInTheDocument();
//     });
//   });

//   it("should handle logout and redirect to login page", () => {
//     // Mock window.location.href
//     setWindowLocation("http://localhost/home");

//     // Render the component
//     render(
//       <Router>
//         <DashboardNavbar />
//       </Router>
//     );

//     // Find and click the logout button
//     const logoutButton = screen.getByText("Logout");
//     fireEvent.click(logoutButton);

//     // Check if the user is redirected to the login page
//     expect(window.location.href).toContain("/login");
//   });

//   it("should navigate to profile page", () => {
//     // Render the component
//     render(
//       <Router>
//         <DashboardNavbar />
//       </Router>
//     );

//     // Find and click the profile button
//     const profileButton = screen.getByText("Profile");
//     fireEvent.click(profileButton);

//     // Check if the navigate function was called with the correct arguments
//     const navigate = require('react-router-dom').useNavigate();
//     expect(navigate).toHaveBeenCalledWith("/profile");
//   });
// });

  
