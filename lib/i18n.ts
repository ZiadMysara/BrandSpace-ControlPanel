export const locales = ["en", "ar"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    users: "Users",
    malls: "Malls",
    shops: "Shops",
    inquiries: "Inquiries",
    bookings: "Bookings",
    payments: "Payments",
    notifications: "Notifications",
    settings: "Settings",

    // Common
    add: "Add",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    search: "Search",
    filter: "Filter",
    export: "Export",
    actions: "Actions",
    status: "Status",
    active: "Active",
    inactive: "Inactive",

    // Dashboard
    totalMalls: "Total Malls",
    totalShops: "Total Shops",
    totalBookings: "Total Bookings",
    totalRevenue: "Total Revenue",
    recentInquiries: "Recent Inquiries",
    monthlyTrends: "Monthly Trends",

    // User Management
    userManagement: "User Management",
    addUser: "Add User",
    editUser: "Edit User",
    userName: "User Name",
    email: "Email",
    phone: "Phone",
    userType: "User Type",
    position: "Position",

    // Mall Management
    mallManagement: "Mall Management",
    addMall: "Add Mall",
    editMall: "Edit Mall",
    mallName: "Mall Name",
    developer: "Developer",
    city: "City",
    district: "District",
    totalArea: "Total Area",

    // Shop Management
    shopManagement: "Shop Management",
    addShop: "Add Shop",
    editShop: "Edit Shop",
    shopTitle: "Shop Title",
    mall: "Mall",
    category: "Category",
    monthlyRent: "Monthly Rent",
    salePrice: "Sale Price",

    // Inquiry Management
    inquiryManagement: "Inquiry Management",
    inquiryType: "Inquiry Type",
    message: "Message",
    contactPreference: "Contact Preference",
    pending: "Pending",
    responded: "Responded",
    closed: "Closed",

    // Booking Management
    bookingManagement: "Booking Management",
    bookingType: "Booking Type",
    startDate: "Start Date",
    endDate: "End Date",
    totalAmount: "Total Amount",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    completed: "Completed",

    // Payment Management
    paymentManagement: "Payment Management",
    amount: "Amount",
    paymentType: "Payment Type",
    paymentMethod: "Payment Method",
    paymentStatus: "Payment Status",
    transactionId: "Transaction ID",

    // Settings
    appSettings: "App Settings",
    generalSettings: "General Settings",
    emailSettings: "Email Settings",
    notificationSettings: "Notification Settings",
  },
  ar: {
    // Navigation
    dashboard: "لوحة التحكم",
    users: "المستخدمين",
    malls: "المولات",
    shops: "المحلات",
    inquiries: "الاستفسارات",
    bookings: "الحجوزات",
    payments: "المدفوعات",
    notifications: "الإشعارات",
    settings: "الإعدادات",

    // Common
    add: "إضافة",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    search: "بحث",
    filter: "تصفية",
    export: "تصدير",
    actions: "الإجراءات",
    status: "الحالة",
    active: "نشط",
    inactive: "غير نشط",

    // Dashboard
    totalMalls: "إجمالي المولات",
    totalShops: "إجمالي المحلات",
    totalBookings: "إجمالي الحجوزات",
    totalRevenue: "إجمالي الإيرادات",
    recentInquiries: "الاستفسارات الأخيرة",
    monthlyTrends: "الاتجاهات الشهرية",

    // User Management
    userManagement: "إدارة المستخدمين",
    addUser: "إضافة مستخدم",
    editUser: "تعديل مستخدم",
    userName: "اسم المستخدم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    userType: "نوع المستخدم",
    position: "المنصب",

    // Mall Management
    mallManagement: "إدارة المولات",
    addMall: "إضافة مول",
    editMall: "تعديل مول",
    mallName: "اسم المول",
    developer: "المطور",
    city: "المدينة",
    district: "الحي",
    totalArea: "المساحة الإجمالية",

    // Shop Management
    shopManagement: "إدارة المحلات",
    addShop: "إضافة محل",
    editShop: "تعديل محل",
    shopTitle: "عنوان المحل",
    mall: "المول",
    category: "الفئة",
    monthlyRent: "الإيجار الشهري",
    salePrice: "سعر البيع",

    // Inquiry Management
    inquiryManagement: "إدارة الاستفسارات",
    inquiryType: "نوع الاستفسار",
    message: "الرسالة",
    contactPreference: "تفضيل التواصل",
    pending: "معلق",
    responded: "تم الرد",
    closed: "مغلق",

    // Booking Management
    bookingManagement: "إدارة الحجوزات",
    bookingType: "نوع الحجز",
    startDate: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    totalAmount: "المبلغ الإجمالي",
    confirmed: "مؤكد",
    cancelled: "ملغي",
    completed: "مكتمل",

    // Payment Management
    paymentManagement: "إدارة المدفوعات",
    amount: "المبلغ",
    paymentType: "نوع الدفع",
    paymentMethod: "طريقة الدفع",
    paymentStatus: "حالة الدفع",
    transactionId: "رقم المعاملة",

    // Settings
    appSettings: "إعدادات التطبيق",
    generalSettings: "الإعدادات العامة",
    emailSettings: "إعدادات البريد الإلكتروني",
    notificationSettings: "إعدادات الإشعارات",
  },
}

export function getTranslation(locale: Locale, key: keyof typeof translations.en): string {
  return translations[locale][key] || translations.en[key]
}
