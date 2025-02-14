const ROUTES = {
  AUTH: {
    LOGIN: "/api/v1/login",
    REGISTER: "/api/v1/register",
    VERIFYOTP: "/api/v1/verify-otp",
    RESENDOTP: "/api/v1/resend-otp",
    FORGETPASSWORD: "/api/v1/forgot-password",
    RESETPASSWORD: "/api/v1/reset-password",
    SOCIALAUTH: "/api/v1/social-login",
    MYPROFILE: "/api/v1/myprofile",
    EDITPROFILE: "/api/v1/profile-update",
    CHANGEPASSWORD: "/api/v1/change-password",
    MOBILEVERIFY: "api/v1/update-phoneno",
    NOTIFICATION: "/api/v1/notificationList",
    LOGOUT: "/api/v1/logout",
    PROFILEPICTURE:"api/v1/profile-picture-update"
  },
  SERVICES: {
    INQUIRY: "/api/v1/inquiry",
    PACKAGES: "/api/v1/getPackages",
    PURCHASEPACKAGE: "/api/v1/purchasePackage",
    GETPURCHASEPACKAGE: "/api/v1/getUserPackage"
  },
  CONTACT: {
    CONTACTUS: "/api/v1/getContactUs"
  },
  ABOUT: {
    ABOUTUS: "/api/v1/getDetails/aboutUs"
  },
  PRIVACY: {
    PRIVACYPOLICY: "/api/v1/getDetails/aboutUs"
  },
  FAQ: {
    FAQDATA: "/api/v1/getFaq"
  },
  TERM: {
    TERMANDCONDITION: "/api/v1/getDetails/termsConditions"
  },
  PAYMENT: {
    CREATEORDER: "/api/v1/create-order-id",
    VERIFYPAYMENT: "/api/v1/update-order-status"
  },
  VISUALIZER: {
    GENRATEDIMAGE: "/api/v1/final-image-upload",
    UPLOADFABRIC: "/api/v1/addFabric",
    GETTEMPLATE:"/api/v1/getTemplates"
  },
  DASHBOARD: {
    GETDASHBOARDDATA: "/api/v1/get-dashboard-data"
  }
}
export { ROUTES };