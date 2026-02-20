import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

type Language = 'en' | 'fr';

type AppCopy = {
  logoText: string;
  loginRegisterTitle: string;
  loginRegisterSubtitle: string;
  loginWelcomeTitle: string;
  loginWelcomeSubtitle: string;
  loginPageSubtitle: string;
  loginEmailHelp: string;
  loginShowPassword: string;
  loginHidePassword: string;
  registerFormLabel: string;
  loginFormLabel: string;
  emailAddressLabel: string;
  emailPlaceholder: string;
  emailAdminPlaceholder: string;
  passwordLabel: string;
  createPasswordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  passwordPlaceholder: string;
  rememberMeText: string;
  forgotPasswordText: string;
  createAccountAriaLabel: string;
  createAccountLoading: string;
  createAccountText: string;
  existingAccountText: string;
  signInText: string;
  loginAriaLabel: string;
  loginLoading: string;
  loginText: string;
  newUserText: string;
  createAccountLink: string;
  footerPrefix: string;
  footerMiddle: string;
  termsUseText: string;
  privacyPolicyText: string;
  termsUseLabel: string;
  privacyPolicyLabel: string;
  copyrightText: string;
  themeSwitchToLight: string;
  themeSwitchToDark: string;
  switchToFrenchLabel: string;
  switchToEnglishLabel: string;
  loginSuccessToast: string;
  loginInvalidMessage: string;
  loginInvalidToast: string;
  registerPasswordMismatch: string;
  registerSuccessToast: string;
  registerErrorMessage: string;
  registerErrorToast: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  dashboardRecentPosts: string;
  dashboardViewAllText: string;
  dashboardViewAllAriaLabel: string;
  dashboardViewPostPrefix: string;
  dashboardCoverAltPrefix: string;
  dashboardCategoryLabel: string;
  dashboardEmptyText: string;
  dashboardLoadError: string;
  dashboardStatsTotalLabel: string;
  dashboardStatsEventsLabel: string;
  dashboardStatsAnnouncementsLabel: string;
  dashboardStatsNewsLabel: string;
  dashboardAnalyticsTitle: string;
  dashboardAnalyticsSubtitle: string;
  dashboardAnalyticsLoading: string;
  dashboardAnalyticsError: string;
  dashboardAnalyticsRangeLabel: string;
  dashboardAnalyticsPostsLabel: string;
  dashboardAnalyticsPublishedLabel: string;
  dashboardAnalyticsDraftLabel: string;
  dashboardAnalyticsReviewLabel: string;
  dashboardAnalyticsUsersLabel: string;
  dashboardAnalyticsTotalUsersLabel: string;
  dashboardAnalyticsActiveUsersLabel: string;
  dashboardAnalyticsNewUsersLabel: string;
  dashboardAnalyticsLoginsLabel: string;
  dashboardAnalyticsUserActivityLabel: string;
  dashboardAnalyticsPostActivityLabel: string;
  dashboardAnalyticsTopContentLabel: string;
  dashboardAnalyticsTopContentHint: string;
  dashboardAnalyticsTopContentEmpty: string;
  dashboardAnalyticsReportTitle: string;
  dashboardAnalyticsReportSection: string;
  dashboardAnalyticsReportMetric: string;
  dashboardAnalyticsReportValue: string;
  dashboardReportExportCsv: string;
  dashboardReportExportPdf: string;
  dashboardUsersTitle: string;
  dashboardUsersCountSuffix: string;
  dashboardUsersLoading: string;
  dashboardUsersEmpty: string;
  dashboardUsersError: string;
  dashboardUsersRestricted: string;
  dashboardUsersNameLabel: string;
  dashboardUsersEmailLabel: string;
  dashboardUsersRoleLabel: string;
  dashboardUsersJoinedLabel: string;
  usersFiltersAria: string;
  usersFilterSearch: string;
  usersFilterSearchPlaceholder: string;
  usersFilterRole: string;
  usersFilterAllRoles: string;
  usersFilterFrom: string;
  usersFilterTo: string;
  usersFilterReset: string;
  usersRoleAdmin: string;
  usersRoleUser: string;
  usersStatusLabel: string;
  usersStatusActive: string;
  usersStatusLocked: string;
  usersActionsLabel: string;
  usersMakeAdmin: string;
  usersMakeUser: string;
  usersLock: string;
  usersUnlock: string;
  usersResetPassword: string;
  postsTitle: string;
  postsNewButton: string;
  postsCreateAriaLabel: string;
  postsFilterSearch: string;
  postsFilterSearchPlaceholder: string;
  postsFilterStatus: string;
  postsFilterAllStatuses: string;
  postsFilterDraft: string;
  postsFilterReview: string;
  postsFilterPublished: string;
  postsFilterAuthor: string;
  postsFilterAllAuthors: string;
  postsFilterFrom: string;
  postsFilterTo: string;
  postsFilterReset: string;
  postsCoverAltPrefix: string;
  postsCategoryLabel: string;
  postsMetaLabel: string;
  postsTimeLabel: string;
  postsLocationLabel: string;
  postsViewDetailsText: string;
  postsViewDetailsPrefix: string;
  postsActionsLabel: string;
  postsEditPrefix: string;
  postsDeletePrefix: string;
  postsEmptyText: string;
  postsCreateFirstAriaLabel: string;
  postsCreateFirstButton: string;
  postsPaginationLabel: string;
  postsPrevAriaLabel: string;
  postsPrevText: string;
  postsNextAriaLabel: string;
  postsNextText: string;
  postsPageLabel: string;
  postsOfText: string;
  postsCountSuffix: string;
  postsLoadError: string;
  postsDeleteTitle: string;
  postsDeleteMessage: string;
  postsDeleteConfirm: string;
  commonCancel: string;
  postsDeleteSuccess: string;
  postsDeleteError: string;
  postsRemoveFilterLabel: string;
  postsImageFallbackText: string;
  postsPublishTitle: string;
  postsPublishMessage: string;
  postsPublishConfirm: string;
  postsSubmitReviewTitle: string;
  postsSubmitReviewMessage: string;
  postsSubmitReviewConfirm: string;
  postsPublishSuccess: string;
  postsPublishError: string;
  postsSubmitReviewSuccess: string;
  postsSubmitReviewError: string;
  postsDraftSuccess: string;
  postsStatusChangeError: string;
  postDetailBack: string;
  postDetailEdit: string;
  postDetailDelete: string;
  postDetailExternalLink: string;
  postDetailShownHome: string;
  postDetailShownRegistration: string;
  postDetailCreated: string;
  postDetailUpdated: string;
  postDetailNotFound: string;
  postDetailGoBack: string;
  postDetailLoadError: string;
  postFormBack: string;
  postFormEditTitle: string;
  postFormNewTitle: string;
  postFormSubtitle: string;
  postFormStatusLabel: string;
  postFormStatusHint: string;
  postFormSectionContent: string;
  postFormSectionPublish: string;
  postFormSectionVisibility: string;
  postFormCategoryLabel: string;
  postFormCategoryEvent: string;
  postFormCategoryAnnouncement: string;
  postFormCategoryNews: string;
  postFormTitleLabel: string;
  postFormTitlePlaceholder: string;
  postFormImageUrlLabel: string;
  postFormImagePlaceholder: string;
  postFormImagePreviewAlt: string;
  postFormImageHelp: string;
  postFormImageInvalid: string;
  postFormExcerptLabel: string;
  postFormExcerptPlaceholder: string;
  postFormContentLabel: string;
  postFormContentPlaceholder: string;
  postFormDateLabel: string;
  postFormTimeLabel: string;
  postFormTimePlaceholder: string;
  postFormLocationLabel: string;
  postFormLocationPlaceholder: string;
  postFormExternalLinkLabel: string;
  postFormExternalLinkPlaceholder: string;
  postFormExternalLinkHelp: string;
  postFormShowHome: string;
  postFormShowRegistration: string;
  postFormCancel: string;
  postFormSaveDraft: string;
  postFormUpdate: string;
  postFormPublish: string;
  postFormNotFound: string;
  postFormLoadError: string;
  postFormAuthRequired: string;
  postFormUpdateSuccess: string;
  postFormCreateSuccess: string;
  postFormSaveError: string;
  postFormPreviewTitle: string;
  postFormPreviewSubtitle: string;
  postFormPreviewButton: string;
  postFormPreviewClose: string;
  postFormPreviewTitlePlaceholder: string;
  postFormPreviewExcerptPlaceholder: string;
  postFormPreviewContentPlaceholder: string;
  postFormPreviewImageFallback: string;
  commonNotAvailable: string;
  exportCsvText: string;
  exportPdfText: string;
  exportNoData: string;
  exportStarted: string;
  exportFailed: string;
  exportCreatedLabel: string;
  exportUpdatedLabel: string;
  settingsTitle: string;
  settingsProfileTitle: string;
  settingsProfileSubtitle: string;
  settingsAccountTitle: string;
  settingsAvatarAlt: string;
  settingsProfilePictureLabel: string;
  settingsAvatarChangeLabel: string;
  settingsAvatarHelp: string;
  settingsAvatarPlaceholder: string;
  settingsFullNameLabel: string;
  settingsEmailLabel: string;
  settingsEmailHelp: string;
  settingsSaveChanges: string;
  settingsLastUpdatedLabel: string;
  settingsUserIdLabel: string;
  settingsRoleLabel: string;
  settingsMemberSinceLabel: string;
  settingsProfileUpdatedToast: string;
  placeholderTitle: string;
  placeholderSubtitle: string;
  sidebarTitle: string;
  sidebarCloseLabel: string;
  sidebarNavDashboard: string;
  sidebarNavPosts: string;
  sidebarNavUsers: string;
  sidebarNavAudit: string;
  sidebarNavSettings: string;
  sidebarLogoutLabel: string;
  sidebarLogoutTitle: string;
  sidebarLogoutMessage: string;
  sidebarLogoutConfirm: string;
  sidebarNavAriaLabel: string;
  auditLogTitle: string;
  auditLogSubtitle: string;
  auditLogSearchLabel: string;
  auditLogSearchPlaceholder: string;
  auditLogActionLabel: string;
  auditLogActionAll: string;
  auditLogActionLogin: string;
  auditLogActionRegister: string;
  auditLogActionRoleUpdated: string;
  auditLogActionLockUpdated: string;
  auditLogActionPasswordReset: string;
  auditLogActionPostCreated: string;
  auditLogActionPostUpdated: string;
  auditLogActionPostDeleted: string;
  auditLogEntityLabel: string;
  auditLogEntityAll: string;
  auditLogEntityUser: string;
  auditLogEntityPost: string;
  auditLogEntityAuth: string;
  auditLogActorLabel: string;
  auditLogActorPlaceholder: string;
  auditLogFromLabel: string;
  auditLogToLabel: string;
  auditLogResetFilters: string;
  auditLogLoading: string;
  auditLogEmpty: string;
  auditLogLoadError: string;
  auditLogTableTime: string;
  auditLogTableActor: string;
  auditLogTableAction: string;
  auditLogTableEntity: string;
  auditLogTableIp: string;
  auditLogTableDetails: string;
  auditLogCountSuffix: string;
  auditLogPaginationLabel: string;
  auditLogPrevText: string;
  auditLogNextText: string;
  auditLogPageLabel: string;
  auditLogOfText: string;
  headerGreetingPrefix: string;
  headerGuestName: string;
  headerThemeLabel: string;
  headerLanguageLabel: string;
  headerMenuToggleLabel: string;
  utilityMenuLabel: string;  themeLightLabel: string;
  themeDarkLabel: string;
  searchGlobalPlaceholder: string;
  searchNoResults: string;
  searchResultsCount: string;
  searchResultPost: string;
  searchResultUser: string;
  searchResultAudit: string;
  searchMatchedIn: string;
  searchClearFilters: string;
  searchSaveFilter: string;
  searchLoadFilter: string;
  advancedFiltersTitle: string;
  advancedFiltersApply: string;
  advancedFiltersClear: string;
  editorBold: string;
  editorItalic: string;
  editorUnderline: string;
  editorStrike: string;
  editorHeading: string;
  editorHeading1: string;
  editorHeading2: string;
  editorHeading3: string;
  editorNormal: string;
  editorOrderedList: string;
  editorBulletList: string;
  editorAlign: string;
  editorLink: string;
  editorImage: string;
  editorBlockquote: string;
  editorCodeBlock: string;
  editorClearFormat: string;
  editorCharacters: string;
};

const translations: Record<Language, AppCopy> = {
  en: {
    logoText: 'State Council of the DRC',
    loginRegisterTitle: 'Create your account',
    loginRegisterSubtitle: 'Fill in your details to get started',
    loginWelcomeTitle: 'Welcome to State Council',
    loginWelcomeSubtitle: 'Please login to your account',
    loginPageSubtitle: 'Secure access',
    loginEmailHelp: 'Use a valid email address (name@example.com).',
    loginShowPassword: 'Show',
    loginHidePassword: 'Hide',
    registerFormLabel: 'Create account form',
    loginFormLabel: 'Login form',
    emailAddressLabel: 'Email Address',
    emailPlaceholder: 'you@example.com',
    emailAdminPlaceholder: 'admin@statecounciladmin.com',
    passwordLabel: 'Password',
    createPasswordPlaceholder: 'Create a password',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    passwordPlaceholder: '••••••••••',
    rememberMeText: 'Remember me',
    forgotPasswordText: 'Forgot your password?',
    createAccountAriaLabel: 'Create your account',
    createAccountLoading: 'CREATING ACCOUNT...',
    createAccountText: 'CREATE ACCOUNT',
    existingAccountText: 'Already have an account?',
    signInText: 'Sign In',
    loginAriaLabel: 'Login to your account',
    loginLoading: 'SIGNING IN...',
    loginText: 'LOGIN',
    newUserText: 'New to the site?',
    createAccountLink: 'Create an Account',
    footerPrefix: 'Registering to this website, you accept our',
    footerMiddle: ' and our ',
    termsUseText: 'Terms of use',
    privacyPolicyText: 'Privacy policy',
    termsUseLabel: 'Read our terms of use',
    privacyPolicyLabel: 'Read our privacy policy',
    copyrightText: '© 2026 State Council. All rights reserved',
    themeSwitchToLight: 'Switch to light theme',
    themeSwitchToDark: 'Switch to dark theme',
    switchToFrenchLabel: 'Switch language to French',
    switchToEnglishLabel: 'Switch language to English',
    loginSuccessToast: 'Login successful! Welcome back.',
    loginInvalidMessage: 'Invalid email or password.',
    loginInvalidToast: 'Invalid email or password. Please try again.',
    registerPasswordMismatch: 'Passwords do not match.',
    registerSuccessToast: 'Account created successfully. Please sign in.',
    registerErrorMessage: 'Unable to create account. Please try again.',
    registerErrorToast: 'Registration failed. Please try again.',
    dashboardTitle: 'Dashboard',
    dashboardSubtitle: 'Recent articles',
    dashboardRecentPosts: 'All Posts',
    dashboardViewAllText: 'View All →',
    dashboardViewAllAriaLabel: 'View all blog posts',
    dashboardViewPostPrefix: 'View post:',
    dashboardCoverAltPrefix: 'Cover image for',
    dashboardCategoryLabel: 'Category',
    dashboardEmptyText: 'No posts yet',
    dashboardLoadError: 'Failed to load recent posts.',
    dashboardStatsTotalLabel: 'Total',
    dashboardStatsEventsLabel: 'Events',
    dashboardStatsAnnouncementsLabel: 'Announcements',
    dashboardStatsNewsLabel: 'News',
    dashboardAnalyticsTitle: 'Analytics',
    dashboardAnalyticsSubtitle: 'Operational overview',
    dashboardAnalyticsLoading: 'Loading analytics...',
    dashboardAnalyticsError: 'Failed to load analytics.',
    dashboardAnalyticsRangeLabel: 'Last {days} days',
    dashboardAnalyticsPostsLabel: 'Posts',
    dashboardAnalyticsPublishedLabel: 'Published',
    dashboardAnalyticsDraftLabel: 'Drafts',
    dashboardAnalyticsReviewLabel: 'In review',
    dashboardAnalyticsUsersLabel: 'Users',
    dashboardAnalyticsTotalUsersLabel: 'Total users',
    dashboardAnalyticsActiveUsersLabel: 'Active users',
    dashboardAnalyticsNewUsersLabel: 'New users',
    dashboardAnalyticsLoginsLabel: 'Logins',
    dashboardAnalyticsUserActivityLabel: 'User activity',
    dashboardAnalyticsPostActivityLabel: 'Post activity',
    dashboardAnalyticsTopContentLabel: 'Top content',
    dashboardAnalyticsTopContentHint: 'Recent updates',
    dashboardAnalyticsTopContentEmpty: 'No published posts yet.',
    dashboardAnalyticsReportTitle: 'Dashboard report',
    dashboardAnalyticsReportSection: 'Section',
    dashboardAnalyticsReportMetric: 'Metric',
    dashboardAnalyticsReportValue: 'Value',
    dashboardReportExportCsv: 'Export report (CSV)',
    dashboardReportExportPdf: 'Export report (PDF)',
    dashboardUsersTitle: 'Users',
    dashboardUsersCountSuffix: 'users',
    dashboardUsersLoading: 'Loading users...',
    dashboardUsersEmpty: 'No users found.',
    dashboardUsersError: 'Failed to load users.',
    dashboardUsersRestricted: 'Admin access required to view users.',
    dashboardUsersNameLabel: 'Name',
    dashboardUsersEmailLabel: 'Email',
    dashboardUsersRoleLabel: 'Role',
    dashboardUsersJoinedLabel: 'Joined',
    usersFiltersAria: 'User filters',
    usersFilterSearch: 'Search',
    usersFilterSearchPlaceholder: 'Search users',
    usersFilterRole: 'Role',
    usersFilterAllRoles: 'All roles',
    usersFilterFrom: 'From',
    usersFilterTo: 'To',
    usersFilterReset: 'Reset',
    usersRoleAdmin: 'Admin',
    usersRoleUser: 'User',
    usersStatusLabel: 'User status',
    usersStatusActive: 'Active',
    usersStatusLocked: 'Locked',
    usersActionsLabel: 'User actions',
    usersMakeAdmin: 'Make admin',
    usersMakeUser: 'Make user',
    usersLock: 'Lock',
    usersUnlock: 'Unlock',
    usersResetPassword: 'Reset password',
    postsTitle: 'All Posts',
    postsNewButton: 'New Post',
    postsCreateAriaLabel: 'Create a new blog post',
    postsFilterSearch: 'Search',
    postsFilterSearchPlaceholder: 'Search posts',
    postsFilterStatus: 'Status',
    postsFilterAllStatuses: 'All statuses',
    postsFilterDraft: 'Draft',
    postsFilterReview: 'Review',
    postsFilterPublished: 'Published',
    postsFilterAuthor: 'Author',
    postsFilterAllAuthors: 'All authors',
    postsFilterFrom: 'From',
    postsFilterTo: 'To',
    postsFilterReset: 'Reset',
    postsCoverAltPrefix: 'Cover image for',
    postsCategoryLabel: 'Category',
    postsMetaLabel: 'Post metadata',
    postsTimeLabel: 'Time',
    postsLocationLabel: 'Location',
    postsViewDetailsText: 'View Details',
    postsViewDetailsPrefix: 'View details for',
    postsActionsLabel: 'Post actions',
    postsEditPrefix: 'Edit',
    postsDeletePrefix: 'Delete',
    postsEmptyText: 'No posts yet. Create your first post!',
    postsCreateFirstAriaLabel: 'Create your first post',
    postsCreateFirstButton: 'Create Post',
    postsPaginationLabel: 'Posts pagination',
    postsPrevAriaLabel: 'Go to previous page',
    postsPrevText: 'Previous',
    postsNextAriaLabel: 'Go to next page',
    postsNextText: 'Next',
    postsPageLabel: 'Page',
    postsOfText: 'of',
    postsCountSuffix: 'posts',
    postsLoadError: 'Failed to load posts. Please try again.',
    postsDeleteTitle: 'Delete Post',
    postsDeleteMessage: 'Are you sure you want to delete this post? This action cannot be undone.',
    postsDeleteConfirm: 'Delete',
    commonCancel: 'Cancel',
    postsDeleteSuccess: 'Post deleted successfully',
    postsDeleteError: 'Failed to delete post',
    postsRemoveFilterLabel: 'Remove filter:',
    postsImageFallbackText: 'Image not available',
    postsPublishTitle: 'Publish post',
    postsPublishMessage: 'Are you sure you want to publish "{title}"? Once published, it will be visible to all users.',
    postsPublishConfirm: 'Publish',
    postsSubmitReviewTitle: 'Submit for review',
    postsSubmitReviewMessage: 'Submit "{title}" for review? An admin will need to approve it before it\'s published.',
    postsSubmitReviewConfirm: 'Submit',
    postsPublishSuccess: 'Post published successfully',
    postsPublishError: 'Failed to publish post',
    postsSubmitReviewSuccess: 'Post submitted for review',
    postsSubmitReviewError: 'Failed to submit post for review',
    postsDraftSuccess: 'Post status changed to draft',
    postsStatusChangeError: 'Failed to change post status',
    postDetailBack: '« Back to Posts',
    postDetailEdit: 'Edit Post',
    postDetailDelete: 'Delete',
    postDetailExternalLink: '🔗 External Link',
    postDetailShownHome: '✓ Shown on Home Page',
    postDetailShownRegistration: '✓ Shown on Registration',
    postDetailCreated: 'Created:',
    postDetailUpdated: 'Updated:',
    postDetailNotFound: 'Post not found',
    postDetailGoBack: 'Go Back',
    postDetailLoadError: 'Failed to load post',
    postFormBack: '« Back',
    postFormEditTitle: 'Edit Post',
    postFormNewTitle: 'New Post',
    postFormSubtitle: 'Provide the article details',
    postFormStatusLabel: 'Status',
    postFormStatusHint: 'Choose how this post will appear in the public feed.',
    postFormSectionContent: 'Content',
    postFormSectionPublish: 'Publishing',
    postFormSectionVisibility: 'Visibility',
    postFormCategoryLabel: 'Category',
    postFormCategoryEvent: 'Event',
    postFormCategoryAnnouncement: 'Announcement',
    postFormCategoryNews: 'News',
    postFormTitleLabel: 'Title',
    postFormTitlePlaceholder: 'Enter post title',
    postFormImageUrlLabel: 'Image URL',
    postFormImagePlaceholder: 'https://example.com/image.jpg',
    postFormImagePreviewAlt: 'Preview',
    postFormImageHelp: 'Use a direct image URL (jpg, png, or webp).',
    postFormImageInvalid: 'Please use a direct image URL ending with jpg, png, webp, or gif.',
    postFormExcerptLabel: 'Excerpt',
    postFormExcerptPlaceholder: 'Brief description...',
    postFormContentLabel: 'Content',
    postFormContentPlaceholder: 'Write your post content here...',
    postFormDateLabel: 'Date',
    postFormTimeLabel: 'Time',
    postFormTimePlaceholder: '2:00 PM',
    postFormLocationLabel: 'Location (Optional)',
    postFormLocationPlaceholder: 'Event location',
    postFormExternalLinkLabel: 'External Link (Optional)',
    postFormExternalLinkPlaceholder: 'https://example.com',
    postFormExternalLinkHelp: 'Optional link for registration or additional details.',
    postFormShowHome: 'Show on home page',
    postFormShowRegistration: 'Show on Registration',
    postFormCancel: 'Cancel',
    postFormSaveDraft: 'Save Draft',
    postFormUpdate: 'Update Post',
    postFormPublish: 'Publish',
    postFormNotFound: 'Post not found',
    postFormLoadError: 'Failed to load post',
    postFormAuthRequired: 'You must be logged in to create a post',
    postFormUpdateSuccess: 'Post updated successfully',
    postFormCreateSuccess: 'Post created successfully',
    postFormSaveError: 'Failed to save post. Please try again.',
    postFormPreviewTitle: 'Live preview',
    postFormPreviewSubtitle: 'See how your post will look',
    postFormPreviewButton: 'Preview full article',
    postFormPreviewClose: 'Close preview',
    postFormPreviewTitlePlaceholder: 'Post title will appear here',
    postFormPreviewExcerptPlaceholder: 'A short excerpt appears here as you type.',
    postFormPreviewContentPlaceholder: 'Full content preview will appear here.',
    postFormPreviewImageFallback: 'Preview not available',
    commonNotAvailable: 'N/A',
    exportCsvText: 'Export CSV',
    exportPdfText: 'Export PDF',
    exportNoData: 'Nothing to export.',
    exportStarted: 'Export started.',
    exportFailed: 'Export failed. Please try again.',
    exportCreatedLabel: 'Created',
    exportUpdatedLabel: 'Updated',
    settingsTitle: 'Settings',
    settingsProfileTitle: 'Profile Information',
    settingsProfileSubtitle: 'Manage your profile details',
    settingsAccountTitle: 'Account Information',
    settingsAvatarAlt: 'Avatar',
    settingsProfilePictureLabel: 'Profile Picture',
    settingsAvatarChangeLabel: 'Change photo',
    settingsAvatarHelp: 'Accepted formats: jpg, png, webp, or svg.',
    settingsAvatarPlaceholder: 'Avatar URL',
    settingsFullNameLabel: 'Full Name',
    settingsEmailLabel: 'Email Address',
    settingsEmailHelp: 'Used to sign in and receive account updates.',
    settingsSaveChanges: 'Save Changes',
    settingsLastUpdatedLabel: 'Last updated',
    settingsUserIdLabel: 'User ID',
    settingsRoleLabel: 'Role',
    settingsMemberSinceLabel: 'Member Since',
    settingsProfileUpdatedToast: 'Profile updated successfully',
    placeholderTitle: 'Coming Soon',
    placeholderSubtitle: 'This feature is under development',
    sidebarTitle: 'State Council of the DRC Admin',
    sidebarCloseLabel: 'Close navigation menu',
    sidebarNavDashboard: 'Dashboard',
    sidebarNavPosts: 'Posts',
    sidebarNavUsers: 'Users',
    sidebarNavAudit: 'Audit Log',
    sidebarNavSettings: 'Settings',
    sidebarLogoutLabel: 'Log out',
    sidebarLogoutTitle: 'Log out',
    sidebarLogoutMessage: 'Are you sure you want to log out?',
    sidebarLogoutConfirm: 'Log out',
    sidebarNavAriaLabel: 'Main navigation',
    auditLogTitle: 'Audit Log',
    auditLogSubtitle: 'Track admin actions for compliance and review',
    auditLogSearchLabel: 'Search',
    auditLogSearchPlaceholder: 'Search audit logs',
    auditLogActionLabel: 'Action',
    auditLogActionAll: 'All actions',
    auditLogActionLogin: 'Login',
    auditLogActionRegister: 'Register',
    auditLogActionRoleUpdated: 'Role updated',
    auditLogActionLockUpdated: 'Lock updated',
    auditLogActionPasswordReset: 'Password reset',
    auditLogActionPostCreated: 'Post created',
    auditLogActionPostUpdated: 'Post updated',
    auditLogActionPostDeleted: 'Post deleted',
    auditLogEntityLabel: 'Entity',
    auditLogEntityAll: 'All entities',
    auditLogEntityUser: 'User',
    auditLogEntityPost: 'Post',
    auditLogEntityAuth: 'Auth',
    auditLogActorLabel: 'Actor',
    auditLogActorPlaceholder: 'Admin email or ID',
    auditLogFromLabel: 'From',
    auditLogToLabel: 'To',
    auditLogResetFilters: 'Reset',
    auditLogLoading: 'Loading audit logs...',
    auditLogEmpty: 'No audit activity yet.',
    auditLogLoadError: 'Failed to load audit logs.',
    auditLogTableTime: 'Time',
    auditLogTableActor: 'Actor',
    auditLogTableAction: 'Action',
    auditLogTableEntity: 'Entity',
    auditLogTableIp: 'IP',
    auditLogTableDetails: 'Details',
    auditLogCountSuffix: 'events',
    auditLogPaginationLabel: 'Audit log pagination',
    auditLogPrevText: 'Previous',
    auditLogNextText: 'Next',
    auditLogPageLabel: 'Page',
    auditLogOfText: 'of',
    headerGreetingPrefix: 'Hello',
    headerGuestName: 'Guest',
    headerThemeLabel: 'Theme',
    headerLanguageLabel: 'Language',
    headerMenuToggleLabel: 'Toggle navigation menu',
    utilityMenuLabel: 'Preferences',
    themeLightLabel: 'Light',
    themeDarkLabel: 'Dark',
    searchGlobalPlaceholder: 'Search everything...',
    searchNoResults: 'No results found',
    searchResultsCount: '{count} results found',
    searchResultPost: 'Post',
    searchResultUser: 'User',
    searchResultAudit: 'Audit Log',
    searchMatchedIn: 'Matched in:',
    searchClearFilters: 'Clear all filters',
    searchSaveFilter: 'Save filter',
    searchLoadFilter: 'Load saved filter',
    advancedFiltersTitle: 'Advanced Filters',
    advancedFiltersApply: 'Apply Filters',
    advancedFiltersClear: 'Clear Filters',
    editorBold: 'Bold',
    editorItalic: 'Italic',
    editorUnderline: 'Underline',
    editorStrike: 'Strikethrough',
    editorHeading: 'Heading',
    editorHeading1: 'Heading 1',
    editorHeading2: 'Heading 2',
    editorHeading3: 'Heading 3',
    editorNormal: 'Normal',
    editorOrderedList: 'Numbered list',
    editorBulletList: 'Bullet list',
    editorAlign: 'Text alignment',
    editorLink: 'Insert link',
    editorImage: 'Insert image',
    editorBlockquote: 'Quote',
    editorCodeBlock: 'Code block',
    editorClearFormat: 'Clear formatting',
    editorCharacters: 'characters'
  },
  fr: {
    logoText: 'Conseil d\'État de la RDC',
    loginRegisterTitle: 'Créez votre compte',
    loginRegisterSubtitle: 'Renseignez vos informations pour commencer',
    loginWelcomeTitle: 'Bienvenue au Conseil d\'État',
    loginWelcomeSubtitle: 'Veuillez vous connecter à votre compte',
    loginPageSubtitle: 'Accès sécurisé',
    loginEmailHelp: 'Utilisez une adresse e-mail valide (nom@exemple.com).',
    loginShowPassword: 'Afficher',
    loginHidePassword: 'Masquer',
    registerFormLabel: 'Formulaire de création de compte',
    loginFormLabel: 'Formulaire de connexion',
    emailAddressLabel: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    emailAdminPlaceholder: 'admin@statecounciladmin.com',
    passwordLabel: 'Mot de passe',
    createPasswordPlaceholder: 'Créez un mot de passe',
    confirmPasswordLabel: 'Confirmez le mot de passe',
    confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
    passwordPlaceholder: '••••••••••',
    rememberMeText: 'Se souvenir de moi',
    forgotPasswordText: 'Mot de passe oublié ?',
    createAccountAriaLabel: 'Créez votre compte',
    createAccountLoading: 'CRÉATION DU COMPTE...',
    createAccountText: 'CRÉER UN COMPTE',
    existingAccountText: 'Vous avez déjà un compte ?',
    signInText: 'Se connecter',
    loginAriaLabel: 'Se connecter à votre compte',
    loginLoading: 'CONNEXION...',
    loginText: 'SE CONNECTER',
    newUserText: 'Nouveau sur le site ?',
    createAccountLink: 'Créer un compte',
    footerPrefix: 'En vous inscrivant sur ce site, vous acceptez nos',
    footerMiddle: ' et notre ',
    termsUseText: 'Conditions d\'utilisation',
    privacyPolicyText: 'Politique de confidentialité',
    termsUseLabel: 'Lire nos conditions d\'utilisation',
    privacyPolicyLabel: 'Lire notre politique de confidentialité',
    copyrightText: '© 2026 State Council. Tous droits réservés',
    themeSwitchToLight: 'Passer au thème clair',
    themeSwitchToDark: 'Passer au thème sombre',
    switchToFrenchLabel: 'Passer la langue en français',
    switchToEnglishLabel: 'Passer la langue en anglais',
    loginSuccessToast: 'Connexion réussie ! Bon retour.',
    loginInvalidMessage: 'Adresse e-mail ou mot de passe invalide.',
    loginInvalidToast: 'Adresse e-mail ou mot de passe invalide. Veuillez réessayer.',
    registerPasswordMismatch: 'Les mots de passe ne correspondent pas.',
    registerSuccessToast: 'Compte créé avec succès. Veuillez vous connecter.',
    registerErrorMessage: 'Impossible de créer le compte. Veuillez réessayer.',
    registerErrorToast: 'Échec de l\'inscription. Veuillez réessayer.',
    dashboardTitle: 'Tableau de bord',
    dashboardSubtitle: 'Articles récents',
    dashboardRecentPosts: 'Tous les articles',
    dashboardViewAllText: 'Voir tout →',
    dashboardViewAllAriaLabel: 'Voir tous les articles',
    dashboardViewPostPrefix: 'Voir l\'article :',
    dashboardCoverAltPrefix: 'Image de couverture pour',
    dashboardCategoryLabel: 'Catégorie',
    dashboardEmptyText: 'Aucun article pour le moment',
    dashboardLoadError: 'Impossible de charger les articles récents.',
    dashboardStatsTotalLabel: 'Total',
    dashboardStatsEventsLabel: 'Événements',
    dashboardStatsAnnouncementsLabel: 'Annonces',
    dashboardStatsNewsLabel: 'Actualités',
    dashboardAnalyticsTitle: 'Analytique',
    dashboardAnalyticsSubtitle: 'Vue d’ensemble opérationnelle',
    dashboardAnalyticsLoading: 'Chargement des statistiques...',
    dashboardAnalyticsError: 'Impossible de charger les statistiques.',
    dashboardAnalyticsRangeLabel: 'Derniers {days} jours',
    dashboardAnalyticsPostsLabel: 'Publications',
    dashboardAnalyticsPublishedLabel: 'Publiées',
    dashboardAnalyticsDraftLabel: 'Brouillons',
    dashboardAnalyticsReviewLabel: 'En revue',
    dashboardAnalyticsUsersLabel: 'Utilisateurs',
    dashboardAnalyticsTotalUsersLabel: 'Utilisateurs totaux',
    dashboardAnalyticsActiveUsersLabel: 'Utilisateurs actifs',
    dashboardAnalyticsNewUsersLabel: 'Nouveaux utilisateurs',
    dashboardAnalyticsLoginsLabel: 'Connexions',
    dashboardAnalyticsUserActivityLabel: 'Activité utilisateurs',
    dashboardAnalyticsPostActivityLabel: 'Activité publications',
    dashboardAnalyticsTopContentLabel: 'Contenus phares',
    dashboardAnalyticsTopContentHint: 'Mises à jour récentes',
    dashboardAnalyticsTopContentEmpty: 'Aucune publication publiée pour le moment.',
    dashboardAnalyticsReportTitle: 'Rapport du tableau de bord',
    dashboardAnalyticsReportSection: 'Section',
    dashboardAnalyticsReportMetric: 'Indicateur',
    dashboardAnalyticsReportValue: 'Valeur',
    dashboardReportExportCsv: 'Exporter le rapport (CSV)',
    dashboardReportExportPdf: 'Exporter le rapport (PDF)',
    dashboardUsersTitle: 'Utilisateurs',
    dashboardUsersCountSuffix: 'utilisateurs',
    dashboardUsersLoading: 'Chargement des utilisateurs...',
    dashboardUsersEmpty: 'Aucun utilisateur trouvé.',
    dashboardUsersError: 'Impossible de charger les utilisateurs.',
    dashboardUsersRestricted: 'Accès admin requis pour voir les utilisateurs.',
    dashboardUsersNameLabel: 'Nom',
    dashboardUsersEmailLabel: 'E-mail',
    dashboardUsersRoleLabel: 'Rôle',
    dashboardUsersJoinedLabel: 'Inscription',
    usersFiltersAria: 'Filtres utilisateurs',
    usersFilterSearch: 'Recherche',
    usersFilterSearchPlaceholder: 'Rechercher des utilisateurs',
    usersFilterRole: 'Rôle',
    usersFilterAllRoles: 'Tous les rôles',
    usersFilterFrom: 'Du',
    usersFilterTo: 'Au',
    usersFilterReset: 'Réinitialiser',
    usersRoleAdmin: 'Admin',
    usersRoleUser: 'Utilisateur',
    usersStatusLabel: 'Statut utilisateur',
    usersStatusActive: 'Actif',
    usersStatusLocked: 'Verrouillé',
    usersActionsLabel: 'Actions utilisateur',
    usersMakeAdmin: 'Passer admin',
    usersMakeUser: 'Passer utilisateur',
    usersLock: 'Verrouiller',
    usersUnlock: 'Déverrouiller',
    usersResetPassword: 'Réinitialiser le mot de passe',
    postsTitle: 'Tous les articles',
    postsNewButton: 'Nouvel article',
    postsFilterSearch: 'Recherche',
    postsFilterSearchPlaceholder: 'Rechercher des articles',
    postsFilterStatus: 'Statut',
    postsFilterAllStatuses: 'Tous les statuts',
    postsFilterDraft: 'Brouillon',
    postsFilterReview: 'En révision',
    postsFilterPublished: 'Publié',
    postsFilterAuthor: 'Auteur',
    postsFilterAllAuthors: 'Tous les auteurs',
    postsFilterFrom: 'Du',
    postsFilterTo: 'Au',
    postsFilterReset: 'Réinitialiser',
    postsCreateAriaLabel: 'Créer un nouvel article',
    postsCoverAltPrefix: 'Image de couverture pour',
    postsCategoryLabel: 'Catégorie',
    postsMetaLabel: 'Métadonnées de l\'article',
    postsTimeLabel: 'Heure',
    postsLocationLabel: 'Lieu',
    postsViewDetailsText: 'Voir les détails',
    postsViewDetailsPrefix: 'Voir les détails pour',
    postsActionsLabel: 'Actions de l\'article',
    postsEditPrefix: 'Modifier',
    postsDeletePrefix: 'Supprimer',
    postsEmptyText: 'Aucun article. Créez votre premier article !',
    postsCreateFirstAriaLabel: 'Créer votre premier article',
    postsCreateFirstButton: 'Créer un article',
    postsPaginationLabel: 'Pagination des articles',
    postsPrevAriaLabel: 'Aller à la page précédente',
    postsPrevText: 'Précédent',
    postsNextAriaLabel: 'Aller à la page suivante',
    postsNextText: 'Suivant',
    postsPageLabel: 'Page',
    postsOfText: 'sur',
    postsCountSuffix: 'articles',
    postsLoadError: 'Impossible de charger les articles. Veuillez réessayer.',
    postsDeleteTitle: 'Supprimer l\'article',
    postsDeleteMessage: 'Voulez-vous vraiment supprimer cet article ? Cette action est irréversible.',
    postsDeleteConfirm: 'Supprimer',
    commonCancel: 'Annuler',
    postsDeleteSuccess: 'Article supprimé avec succès',
    postsDeleteError: 'Échec de la suppression de l\'article',
    postsRemoveFilterLabel: 'Retirer le filtre :',
    postsImageFallbackText: 'Image non disponible',
    postsPublishTitle: 'Publier l\'article',
    postsPublishMessage: 'Voulez-vous vraiment publier "{title}" ? Une fois publié, il sera visible par tous les utilisateurs.',
    postsPublishConfirm: 'Publier',
    postsSubmitReviewTitle: 'Soumettre pour validation',
    postsSubmitReviewMessage: 'Soumettre "{title}" pour validation ? Un admin devra l\'approuver avant publication.',
    postsSubmitReviewConfirm: 'Soumettre',
    postsPublishSuccess: 'Article publié avec succès',
    postsPublishError: 'Échec de la publication de l\'article',
    postsSubmitReviewSuccess: 'Article soumis pour validation',
    postsSubmitReviewError: 'Échec de la soumission pour validation',
    postsDraftSuccess: 'Le statut est passé en brouillon',
    postsStatusChangeError: 'Échec du changement de statut',
    postDetailBack: '« Retour aux articles',
    postDetailEdit: 'Modifier l\'article',
    postDetailDelete: 'Supprimer',
    postDetailExternalLink: '🔗 Lien externe',
    postDetailShownHome: '✓ Affiché sur la page d\'accueil',
    postDetailShownRegistration: '✓ Affiché à l\'inscription',
    postDetailCreated: 'Créé :',
    postDetailUpdated: 'Mis à jour :',
    postDetailNotFound: 'Article introuvable',
    postDetailGoBack: 'Retour',
    postDetailLoadError: 'Impossible de charger l\'article',
    postFormBack: '« Retour',
    postFormEditTitle: 'Modifier l\'article',
    postFormNewTitle: 'Nouvel article',
    postFormSubtitle: 'Renseignez les détails de l\'article',
    postFormStatusLabel: 'Statut',
    postFormStatusHint: 'Choisissez comment cet article apparaîtra dans le flux public.',
    postFormSectionContent: 'Contenu',
    postFormSectionPublish: 'Publication',
    postFormSectionVisibility: 'Visibilité',
    postFormCategoryLabel: 'Catégorie',
    postFormCategoryEvent: 'Événement',
    postFormCategoryAnnouncement: 'Annonce',
    postFormCategoryNews: 'Actualités',
    postFormTitleLabel: 'Titre',
    postFormTitlePlaceholder: 'Saisissez le titre de l\'article',
    postFormImageUrlLabel: 'URL de l\'image',
    postFormImagePlaceholder: 'https://exemple.com/image.jpg',
    postFormImagePreviewAlt: 'Aperçu',
    postFormImageHelp: 'Utilisez une URL directe (jpg, png, ou webp).',
    postFormImageInvalid: 'Veuillez utiliser une URL d\'image directe se terminant par jpg, png, webp ou gif.',
    postFormExcerptLabel: 'Extrait',
    postFormExcerptPlaceholder: 'Description brève...',
    postFormContentLabel: 'Contenu',
    postFormContentPlaceholder: 'Écrivez le contenu de votre article ici...',
    postFormDateLabel: 'Date',
    postFormTimeLabel: 'Heure',
    postFormTimePlaceholder: '14:00',
    postFormLocationLabel: 'Lieu (optionnel)',
    postFormLocationPlaceholder: 'Lieu de l\'événement',
    postFormExternalLinkLabel: 'Lien externe (optionnel)',
    postFormExternalLinkPlaceholder: 'https://exemple.com',
    postFormExternalLinkHelp: 'Lien optionnel pour l\'inscription ou des détails.',
    postFormShowHome: 'Afficher sur la page d\'accueil',
    postFormShowRegistration: 'Afficher à l\'inscription',
    postFormCancel: 'Annuler',
    postFormSaveDraft: 'Enregistrer le brouillon',
    postFormUpdate: 'Mettre à jour',
    postFormPublish: 'Publier',
    postFormNotFound: 'Article introuvable',
    postFormLoadError: 'Impossible de charger l\'article',
    postFormAuthRequired: 'Vous devez être connecté pour créer un article',
    postFormUpdateSuccess: 'Article mis à jour avec succès',
    postFormCreateSuccess: 'Article créé avec succès',
    postFormSaveError: 'Échec de l\'enregistrement. Veuillez réessayer.',
    postFormPreviewTitle: 'Aperçu en direct',
    postFormPreviewSubtitle: 'Voyez le rendu en temps réel',
    postFormPreviewButton: 'Aperçu complet',
    postFormPreviewClose: 'Fermer l\'aperçu',
    postFormPreviewTitlePlaceholder: 'Le titre apparaîtra ici',
    postFormPreviewExcerptPlaceholder: 'Un extrait s\'affiche ici au fur et à mesure.',
    postFormPreviewContentPlaceholder: 'Le contenu complet s\'affichera ici.',
    postFormPreviewImageFallback: 'Aperçu non disponible',
    commonNotAvailable: 'N/A',
    exportCsvText: 'Exporter en CSV',
    exportPdfText: 'Exporter en PDF',
    exportNoData: 'Rien à exporter.',
    exportStarted: 'Export en cours.',
    exportFailed: 'Échec de l’export. Veuillez réessayer.',
    exportCreatedLabel: 'Créé',
    exportUpdatedLabel: 'Mis à jour',
    settingsTitle: 'Paramètres',
    settingsProfileTitle: 'Informations du profil',
    settingsProfileSubtitle: 'Gérer votre profil',
    settingsAccountTitle: 'Informations du compte',
    settingsAvatarAlt: 'Avatar',
    settingsProfilePictureLabel: 'Photo de profil',
    settingsAvatarChangeLabel: 'Changer la photo',
    settingsAvatarHelp: 'Formats acceptés : jpg, png, webp ou svg.',
    settingsAvatarPlaceholder: 'URL de l\'avatar',
    settingsFullNameLabel: 'Nom complet',
    settingsEmailLabel: 'Adresse e-mail',
    settingsEmailHelp: 'Utilisé pour la connexion et les notifications.',
    settingsSaveChanges: 'Enregistrer les modifications',
    settingsLastUpdatedLabel: 'Dernière mise à jour',
    settingsUserIdLabel: 'ID utilisateur',
    settingsRoleLabel: 'Rôle',
    settingsMemberSinceLabel: 'Membre depuis',
    settingsProfileUpdatedToast: 'Profil mis à jour avec succès',
    placeholderTitle: 'Bientôt disponible',
    placeholderSubtitle: 'Cette fonctionnalité est en cours de développement',
    sidebarTitle: 'Administration Conseil d\'État de la RDC',
    sidebarCloseLabel: 'Fermer le menu de navigation',
    sidebarNavDashboard: 'Tableau de bord',
    sidebarNavPosts: 'Articles',
    sidebarNavUsers: 'Utilisateurs',
    sidebarNavAudit: 'Journal d\'audit',
    sidebarNavSettings: 'Paramètres',
    sidebarLogoutLabel: 'Se déconnecter',
    sidebarLogoutTitle: 'Déconnexion',
    sidebarLogoutMessage: 'Voulez-vous vraiment vous déconnecter ?',
    sidebarLogoutConfirm: 'Se déconnecter',
    sidebarNavAriaLabel: 'Navigation principale',
    auditLogTitle: 'Journal d\'audit',
    auditLogSubtitle: 'Suivi des actions admin pour conformité et contrôle',
    auditLogSearchLabel: 'Recherche',
    auditLogSearchPlaceholder: 'Rechercher dans le journal',
    auditLogActionLabel: 'Action',
    auditLogActionAll: 'Toutes les actions',
    auditLogActionLogin: 'Connexion',
    auditLogActionRegister: 'Inscription',
    auditLogActionRoleUpdated: 'Rôle mis à jour',
    auditLogActionLockUpdated: 'Verrou mis à jour',
    auditLogActionPasswordReset: 'Mot de passe réinitialisé',
    auditLogActionPostCreated: 'Article créé',
    auditLogActionPostUpdated: 'Article mis à jour',
    auditLogActionPostDeleted: 'Article supprimé',
    auditLogEntityLabel: 'Entité',
    auditLogEntityAll: 'Toutes les entités',
    auditLogEntityUser: 'Utilisateur',
    auditLogEntityPost: 'Article',
    auditLogEntityAuth: 'Auth',
    auditLogActorLabel: 'Auteur',
    auditLogActorPlaceholder: 'E-mail admin ou ID',
    auditLogFromLabel: 'Du',
    auditLogToLabel: 'Au',
    auditLogResetFilters: 'Réinitialiser',
    auditLogLoading: 'Chargement du journal...',
    auditLogEmpty: 'Aucune activité pour le moment.',
    auditLogLoadError: 'Impossible de charger le journal.',
    auditLogTableTime: 'Heure',
    auditLogTableActor: 'Auteur',
    auditLogTableAction: 'Action',
    auditLogTableEntity: 'Entité',
    auditLogTableIp: 'IP',
    auditLogTableDetails: 'Détails',
    auditLogCountSuffix: 'événements',
    auditLogPaginationLabel: 'Pagination du journal',
    auditLogPrevText: 'Précédent',
    auditLogNextText: 'Suivant',
    auditLogPageLabel: 'Page',
    auditLogOfText: 'sur',
    headerGreetingPrefix: 'Bonjour',
    headerGuestName: 'Invité',
    headerThemeLabel: 'Thème',
    headerLanguageLabel: 'Langue',
    headerMenuToggleLabel: 'Basculer le menu de navigation',
    utilityMenuLabel: 'Préférences',
    themeLightLabel: 'Clair',
    themeDarkLabel: 'Sombre',
    searchGlobalPlaceholder: 'Rechercher partout...',
    searchNoResults: 'Aucun résultat trouvé',
    searchResultsCount: '{count} résultats trouvés',
    searchResultPost: 'Article',
    searchResultUser: 'Utilisateur',
    searchResultAudit: 'Journal d\'audit',
    searchMatchedIn: 'Trouvé dans :',
    searchClearFilters: 'Effacer tous les filtres',
    searchSaveFilter: 'Enregistrer le filtre',
    searchLoadFilter: 'Charger un filtre sauvegardé',
    advancedFiltersTitle: 'Filtres avancés',
    advancedFiltersApply: 'Appliquer les filtres',
    advancedFiltersClear: 'Effacer les filtres',
    editorBold: 'Gras',
    editorItalic: 'Italique',
    editorUnderline: 'Souligné',
    editorStrike: 'Barré',
    editorHeading: 'Titre',
    editorHeading1: 'Titre 1',
    editorHeading2: 'Titre 2',
    editorHeading3: 'Titre 3',
    editorNormal: 'Normal',
    editorOrderedList: 'Liste numérotée',
    editorBulletList: 'Liste à puces',
    editorAlign: 'Alignement du texte',
    editorLink: 'Insérer un lien',
    editorImage: 'Insérer une image',
    editorBlockquote: 'Citation',
    editorCodeBlock: 'Bloc de code',
    editorClearFormat: 'Effacer le formatage',
    editorCharacters: 'caractères'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private storageKey = 'language';
  private document = inject(DOCUMENT);
  private language = signal<Language>('en');

  readonly languageName = this.language.asReadonly();
  readonly copy = computed<AppCopy>(() => translations[this.language()]);
  readonly locale = computed(() => (this.language() === 'fr' ? 'fr-FR' : 'en-US'));

  constructor() {
    this.language.set(this.getInitialLanguage());

    effect(() => {
      const value = this.language();
      const root = this.document.documentElement;

      root.setAttribute('lang', value);

      const view = this.document.defaultView;
      if (view?.localStorage) {
        view.localStorage.setItem(this.storageKey, value);
      }
    });
  }

  toggleLanguage(): void {
    this.language.update((value) => (value === 'en' ? 'fr' : 'en'));
  }

  setLanguage(value: Language): void {
    this.language.set(value);
  }

  private getInitialLanguage(): Language {
    const view = this.document.defaultView;
    if (!view) {
      return 'en';
    }

    const stored = view.localStorage?.getItem(this.storageKey) as Language | null;
    if (stored === 'en' || stored === 'fr') {
      return stored;
    }

    return view.navigator.language?.startsWith('fr') ? 'fr' : 'en';
  }
}
