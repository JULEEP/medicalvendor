import React from "react";
import { Route, Routes } from "react-router-dom";

// Import your components
import DepartmentList from "./Components/department";
import SubDepartmentList from "./Components/subdepartment.js";
import AdminLayout from "./Layout/AdminLayout.jsx";
import AttendanceForm from "./Pages/AttendanceForm.js";
import Dashboard from "./Pages/Dashboard.jsx";
import Holiday from "./Pages/Holiday.js";
import DiagnostiCreate from "./Pages/LeaveApplication.js";
import LeaveApproval from "./Pages/LeaveApproval";
import Leaves from "./Pages/Leaves.js";
import MissingAttendance from "./Pages/MissingAttendance.js";
import MonthlyAttendance from "./Pages/MonthlyAttendance.js";
import WeeklyHoliday from "./Pages/WeeklyHoliday.js";
import Recruitment from "./Components/recruitment.js";
import DiagnosticList from "./Pages/Awardlist.js";
import BackupReset from "./Pages/BackupReset.js";
import LanguageSetup from "./Pages/LanguageSetup.js";
import MessagesTable from "./Pages/Message.js";
import NoticeList from "./Pages/Noticelist.js";
import SentMessagesTable from "./Pages/Sent.js";
import Settings from "./Pages/Setting";
import SetupRulesTable from "./Pages/Setup.js";
import CandidateShortlist from "./Pages/CandidateShortlist.js";
import InterviewList from "./Pages/InterviewList.js";
import CandidateSelection from "./Pages/CandidateSelection.js";
import ClientsTable from "./Pages/ClientsTable.js";
import ProjectsTable from "./Pages/ProjectsTable.js";
import ProjectTasksTable from "./Pages/ProjectTasksTable.js";
import ManageProjects from "./Pages/ManageProject.js";
import CompanyDetailsForm from "./Pages/CompanyDetailsForm.js";
import CompanyList from "./Pages/CompanyList.js";
import DoctorDetailsForm from "./Pages/DoctorDetailsForm.js";
import DoctorList from "./Pages/DoctorList.js";
import StaffDetailsForm from "./Pages/StaffDetailsForm.js";
import StaffList from "./Pages/StaffList.js";
import DiagnosticsBookingList from "./Pages/DiagnosticsBookingList.js";
import DoctorAppointmentList from "./Pages/DoctorAppointmentList.js";
import AppointmentBookingForm from "./Pages/AppointmentBookingForm.js";
import DiagnosticDetail from "./Pages/DiagnosticDetail.js";
import DiagnosticsPendingBooking from "./Pages/DiagnosticsPendingBooking.js";
import DoctorAppointmentListPending from "./Pages/DoctorAppointmentListPending.js";
import LoginPage from "./Pages/Login.js";
import CategoryForm from "./Pages/CategoryForm.js";
import CategoryList from "./Pages/CategoryList.js";
import CompanySidebar from "./Components/CompanySidebar.js";
import DiagnosticsAcceptedBooking from "./Pages/DiagnosticsAcceptedBooking.js";
import DiagnosticsRejectedBooking from "./Pages/DiagnosticsRejectedBooking.js";
import AcceptedAppointmentsList from "./Pages/AcceptedAppointmentsList.js";
import RejectedAppointmentsList from "./Pages/RejectedAppointmentsList.js";
import StaffHistory from "./Pages/StaffHistory.js";
import DiagnosticBookingForm from "./Pages/DiagnosticBookingForm.js";
import CouponsPage from "./Pages/CouponPage.js";
import CreateCoupon from "./Pages/CreateCoupon.js";
import UploadDocuments from "./Pages/UploadDocuments.js";
import DocumentTable from "./Pages/DocumentTable.js";
import CouponHistoryTable from "./Pages/CouponHistoryTable.js";
import CreateProductForm from "./Pages/CreateProduct.js";
import ProductList from "./Pages/ProductList.js";
import BookingList from "./Pages/BookingList.js";
import CompletedBookingList from "./Pages/CompletedBookingList .js";
import CancelledBookingList from "./Pages/CancelledBookingList .js";
import UserList from "./Pages/UserList.js";
import CreatePoster from "./Pages/CreatePoster.js";
import CreateCategory from "./Pages/CreateCategory.js";
import PosterList from "./Pages/PosterList.js";
import CreateLogo from "./Pages/CreateLogo.js";
import LogoList from "./Pages/LogoList.js";
import CreateBusinessCard from "./Pages/CreateBusinessCard.js";
import CreatePlan from "./Pages/CreatePlan.js";
import PlanList from "./Pages/PlanList.js";
import UsersPlansList from "./Pages/UsersPlansList.js";
import PrivacyPolicyForm from "./Pages/PrivacyPolicyForm.js";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage.js";
import AboutUsFormPage from "./Pages/AboutUsFormPage.js";
import GetAboutUsPage from "./Pages/GetAboutUsPage.js";
import ContactUsPage from "./Pages/ContactUsPage.js";
import GetContactUsPage from "./Pages/GetContactUsPage.js";
import CreateVendor from "./Pages/CreateVendor.js";
import VendorList from "./Pages/VendorList.js";
import RedeemedCouponsList from "./Pages/RedeemedCouponsList.js";
import VendorDocumentList from "./Pages/VendorDocumentList.js";
import VendorInvoiceList from "./Pages/VendorInvoiceList.js";
import ReceivedPayments from "./Pages/ReceivedPayments.js";
import AllPayments from "./Pages/AllPayments.js";
import UserProfile from "./Pages/UserProfile.js";
import VendorProfile from "./Pages/VendorProfile.js";
import AllUserCoupons from "./Pages/userCoupons.js";
import Category from "./Pages/CreateCategory.js";
import CreatePharmacy from "./Pages/CreatePharmacy.js";
import PharmacyList from "./Pages/PharmacyList.js";
import CreateMedicine from "./Pages/CreateMedicine.js";
import MedicineList from "./Pages/MedicineList.js";
import SingleMedicine from "./Pages/MedicineDetails.js";
import AllOrders from "./Pages/AllOrders.js";
import SingleOrder from "./Pages/SingleOrder.js";
import UserDetails from "./Pages/UserProfile.js";
import PharmacyDetails from "./Pages/PharmacyDetails.js";
import AllMedicines from "./Pages/AllMedicines.js";
import VendorRegisterPage from "./Pages/VendorRegisterPage.js";
import PrescriptionsComponent from "./Pages/PrescriptionsComponent.js";
import PendingOrders from "./Pages/PendingOrders.js";
import DeliveredOrders from "./Pages/DeliveredOrders.js";
import PeriodicOrders from "./Pages/PeriodicOrders.js";
import PrescriptionOrders from "./Pages/PrescriptionOrder.js";
import CreateVendorQuery from "./Pages/CreateVendorQuery.js";
import NotificationsPage from "./Pages/NotificationsPage.js";
import MyVendorQueries from "./Pages/MyVendorQueries.js";




function App() {
  return (
    <Routes>
      {/* Login page rendered outside AdminLayout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<VendorRegisterPage />} />

      {/* All other routes inside AdminLayout */}
      <Route
        path="/*"
        element={
          <AdminLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/department" element={<DepartmentList />} />
              <Route path="/subdepartment" element={<SubDepartmentList />} />
              <Route path="/attendanceform" element={<AttendanceForm />} />
              <Route path="/monthlyattendance" element={<MonthlyAttendance />} />
              <Route path="/missingattendance" element={<MissingAttendance />} />
              <Route path="/weeklyholiday" element={<WeeklyHoliday />} />
              <Route path="/holiday" element={<Holiday />} />
              <Route path="/create-diagnostic" element={<DiagnostiCreate />} />
              <Route path="/leaves" element={<Leaves />} />
              <Route path="/leaveapproval" element={<LeaveApproval />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/setting" element={<Settings />} />
              <Route path="/languagesetup" element={<LanguageSetup />} />
              <Route path="/backupreset" element={<BackupReset />} />
              <Route path="/diagnosticlist" element={<DiagnosticList />} />
              <Route path="/message" element={<MessagesTable />} />
              <Route path="/noticelist" element={<NoticeList />} />
              <Route path="/sentlist" element={<SentMessagesTable />} />
              <Route path="/setuplist" element={<SetupRulesTable />} />
              <Route path="/candidate-shortlist" element={<CandidateShortlist />} />
              <Route path="/interviewlist" element={<InterviewList />} />
              <Route path="/selectedcandidates" element={<CandidateSelection />} />
              <Route path="/clients" element={<ClientsTable />} />
              <Route path="/projects" element={<ProjectsTable />} />
              <Route path="/task" element={<ProjectTasksTable />} />
              <Route path="/manage-project" element={<ManageProjects />} />
              <Route path="/company-register" element={<CompanyDetailsForm />} />
              <Route path="/companylist" element={<CompanyList />} />
              <Route path="/create-doctor" element={<DoctorDetailsForm />} />
              <Route path="/doctorlist" element={<DoctorList />} />
              <Route path="/staff-register" element={<StaffDetailsForm />} />
              <Route path="/stafflist" element={<StaffList />} />
              <Route path="/diagnosticslist" element={<DiagnosticsBookingList />} />
              <Route path="/diagnosticsacceptedlist" element={<DiagnosticsAcceptedBooking />} />
              <Route path="/diagnosticsrejectedlist" element={<DiagnosticsRejectedBooking />} />
              <Route path="/doctoracceptedlist" element={<AcceptedAppointmentsList />} />
              <Route path="/doctorrejectedlist" element={<RejectedAppointmentsList />} />
              <Route path="/appintmentlist" element={<DoctorAppointmentList />} />
              <Route path="/appintmentbooking" element={<AppointmentBookingForm />} />
              <Route path="/diagnostic-center/:id" element={<DiagnosticDetail />} />
              <Route path="/diagnosticpending" element={<DiagnosticsPendingBooking />} />
              <Route path="/doctorpendingbookings" element={<DoctorAppointmentListPending />} />
              <Route path="/categoryform" element={<CategoryForm />} />
              <Route path="/categorylist" element={<CategoryList />} />
              <Route path="/add-product" element={<CreateProductForm />} />
              <Route path="/productlist" element={<ProductList />} />
              <Route path="/allorders" element={<BookingList />} />
              <Route path="/completedorders" element={<CompletedBookingList />} />
              <Route path="/cancelledorders" element={<CancelledBookingList />} />
              <Route path="/companysidebar" element={<CompanySidebar />} />
              <Route path="/staff-history/:staffId" element={<StaffHistory />} /> {/* Route for StaffHistory */}
              <Route path="/book-diagnostic" element={<DiagnosticBookingForm />} />
              <Route path="/coupons" element={<CouponsPage />} />
              <Route path="/couponshistory" element={<CouponHistoryTable />} />
              <Route path="/create-coupon" element={<CreateCoupon />} />
              <Route path="/upload-docs" element={<UploadDocuments />} />
              <Route path="/docs" element={<DocumentTable />} />
              <Route path="/user-coupons" element={<AllUserCoupons />} />

              <Route path="/users" element={<UserList />} />
              <Route path="/users/:userId" element={<UserDetails />} />
              <Route path="/create-category" element={<CreateCategory />} />
              <Route path="/categorylist" element={<CategoryList />} />
              <Route path="/create-poster" element={<CreatePoster />} />
              <Route path="/posterlist" element={<PosterList />} />
              <Route path="/create-logo" element={<CreateLogo />} />
              <Route path="/logolist" element={<LogoList />} />
              <Route path="/create-businesscard" element={<CreateBusinessCard />} />
              <Route path="/create-plan" element={<CreatePlan />} />
              <Route path="/planlist" element={<PlanList />} />
              <Route path="/userplanlist" element={<UsersPlansList />} />
              <Route path="/create-privacy" element={<PrivacyPolicyForm />} />
              <Route path="/get-policy" element={<PrivacyPolicyPage />} />
              <Route path="/aboutus" element={<AboutUsFormPage />} />
              <Route path="/getaboutus" element={<GetAboutUsPage />} />
              <Route path="/contactus" element={<ContactUsPage />} />
              <Route path="/getcontactus" element={<GetContactUsPage />} />
              <Route path="/create-vendor" element={<CreateVendor />} />
              <Route path="/vendorlist" element={<VendorList />} />
              <Route path="/vendordocumentlist" element={<VendorDocumentList />} />
              <Route path="/redeemed-coupons" element={<RedeemedCouponsList />} />
              <Route path="/payment" element={<VendorInvoiceList />} />
              <Route path="/rcvdpayment" element={< ReceivedPayments/>} />
              <Route path="/allpayments" element={< AllPayments/>} />
              <Route path="/users/:id" element={<UserProfile />} />
              <Route path="/vendorprofile" element={<VendorProfile />} />
              <Route path="/category" element={<Category />} />
               <Route path="/create-pharmacy" element={<CreatePharmacy />} />
               <Route path="/pharmacylist" element={<PharmacyList />} />
                 <Route path="/pharmacy/:pharmacyId" element={<PharmacyDetails />} />
               <Route path="/add-medicine" element={<CreateMedicine />} />
              <Route path="/medicines" element={<AllMedicines />} />
              <Route path="/medicine/:medicineId" element={<SingleMedicine />} />
              <Route path="/orders" element={<AllOrders />} />
              <Route path="/pendingorders" element={<PendingOrders />} />
              <Route path="/deliveredorders" element={<DeliveredOrders />} />
              <Route path="/admin/orders/:orderId" element={<SingleOrder />} />
               <Route path="/prescription" element={<PrescriptionsComponent />} />
               <Route path="/priodicorders" element={<PeriodicOrders />} />
              <Route path="/prescriptionorders" element={<PrescriptionOrders />} />
              <Route path="/addquery" element={<CreateVendorQuery />} />
              <Route path="/notifications" element={<NotificationsPage />} />
               <Route path="/myqueries" element={<MyVendorQueries />} />








            </Routes>
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default App;
