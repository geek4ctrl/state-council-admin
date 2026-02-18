import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

type Language = 'en' | 'fr';

type AppCopy = {
  logoText: string;
  loginRegisterTitle: string;
  loginRegisterSubtitle: string;
  loginWelcomeTitle: string;
  loginWelcomeSubtitle: string;
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
  postFormCategoryLabel: string;
  postFormCategoryEvent: string;
  postFormCategoryAnnouncement: string;
  postFormCategoryNews: string;
  postFormTitleLabel: string;
  postFormTitlePlaceholder: string;
  postFormImageUrlLabel: string;
  postFormImagePlaceholder: string;
  postFormImagePreviewAlt: string;
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
  postFormShowHome: string;
  postFormShowRegistration: string;
  postFormCancel: string;
  postFormUpdate: string;
  postFormPublish: string;
  postFormNotFound: string;
  postFormLoadError: string;
  postFormAuthRequired: string;
  postFormUpdateSuccess: string;
  postFormCreateSuccess: string;
  postFormSaveError: string;
  commonNotAvailable: string;
  settingsTitle: string;
  settingsProfileTitle: string;
  settingsAccountTitle: string;
  settingsAvatarAlt: string;
  settingsProfilePictureLabel: string;
  settingsAvatarPlaceholder: string;
  settingsFullNameLabel: string;
  settingsEmailLabel: string;
  settingsSaveChanges: string;
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
};

const translations: Record<Language, AppCopy> = {
  en: {
    logoText: 'State Council',
    loginRegisterTitle: 'Create your account',
    loginRegisterSubtitle: 'Fill in your details to get started',
    loginWelcomeTitle: 'Welcome to State Council',
    loginWelcomeSubtitle: 'Please login to your account',
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
    newUserText: 'New User?',
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
    postFormCategoryLabel: 'Category',
    postFormCategoryEvent: 'Event',
    postFormCategoryAnnouncement: 'Announcement',
    postFormCategoryNews: 'News',
    postFormTitleLabel: 'Title',
    postFormTitlePlaceholder: 'Enter post title',
    postFormImageUrlLabel: 'Image URL',
    postFormImagePlaceholder: 'https://example.com/image.jpg',
    postFormImagePreviewAlt: 'Preview',
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
    postFormShowHome: 'Show on home page',
    postFormShowRegistration: 'Show on Registration',
    postFormCancel: 'Cancel',
    postFormUpdate: 'Update Post',
    postFormPublish: 'Publish',
    postFormNotFound: 'Post not found',
    postFormLoadError: 'Failed to load post',
    postFormAuthRequired: 'You must be logged in to create a post',
    postFormUpdateSuccess: 'Post updated successfully',
    postFormCreateSuccess: 'Post created successfully',
    postFormSaveError: 'Failed to save post. Please try again.',
    commonNotAvailable: 'N/A',
    settingsTitle: 'Settings',
    settingsProfileTitle: 'Profile Information',
    settingsAccountTitle: 'Account Information',
    settingsAvatarAlt: 'Avatar',
    settingsProfilePictureLabel: 'Profile Picture',
    settingsAvatarPlaceholder: 'Avatar URL',
    settingsFullNameLabel: 'Full Name',
    settingsEmailLabel: 'Email Address',
    settingsSaveChanges: 'Save Changes',
    settingsUserIdLabel: 'User ID',
    settingsRoleLabel: 'Role',
    settingsMemberSinceLabel: 'Member Since',
    settingsProfileUpdatedToast: 'Profile updated successfully',
    placeholderTitle: 'Coming Soon',
    placeholderSubtitle: 'This feature is under development',
    sidebarTitle: 'State Council Admin',
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
    headerMenuToggleLabel: 'Toggle navigation menu'
  },
  fr: {
    logoText: 'Conseil d\'Etat',
    loginRegisterTitle: 'Creez votre compte',
    loginRegisterSubtitle: 'Renseignez vos informations pour commencer',
    loginWelcomeTitle: 'Bienvenue au Conseil d\'Etat',
    loginWelcomeSubtitle: 'Veuillez vous connecter a votre compte',
    registerFormLabel: 'Formulaire de creation de compte',
    loginFormLabel: 'Formulaire de connexion',
    emailAddressLabel: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    emailAdminPlaceholder: 'admin@statecounciladmin.com',
    passwordLabel: 'Mot de passe',
    createPasswordPlaceholder: 'Creez un mot de passe',
    confirmPasswordLabel: 'Confirmez le mot de passe',
    confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
    passwordPlaceholder: '••••••••••',
    rememberMeText: 'Se souvenir de moi',
    forgotPasswordText: 'Mot de passe oublie ?',
    createAccountAriaLabel: 'Creez votre compte',
    createAccountLoading: 'CREATION DU COMPTE...',
    createAccountText: 'CREER UN COMPTE',
    existingAccountText: 'Vous avez deja un compte ?',
    signInText: 'Se connecter',
    loginAriaLabel: 'Se connecter a votre compte',
    loginLoading: 'CONNEXION...',
    loginText: 'SE CONNECTER',
    newUserText: 'Nouveau utilisateur ?',
    createAccountLink: 'Creer un compte',
    footerPrefix: 'En vous inscrivant sur ce site, vous acceptez nos',
    footerMiddle: ' et notre ',
    termsUseText: 'Conditions d\'utilisation',
    privacyPolicyText: 'Politique de confidentialite',
    termsUseLabel: 'Lire nos conditions d\'utilisation',
    privacyPolicyLabel: 'Lire notre politique de confidentialite',
    copyrightText: '© 2026 State Council. Tous droits reserves',
    themeSwitchToLight: 'Passer au theme clair',
    themeSwitchToDark: 'Passer au theme sombre',
    switchToFrenchLabel: 'Passer la langue en francais',
    switchToEnglishLabel: 'Passer la langue en anglais',
    loginSuccessToast: 'Connexion reussie ! Bon retour.',
    loginInvalidMessage: 'Adresse e-mail ou mot de passe invalide.',
    loginInvalidToast: 'Adresse e-mail ou mot de passe invalide. Veuillez reessayer.',
    registerPasswordMismatch: 'Les mots de passe ne correspondent pas.',
    registerSuccessToast: 'Compte cree avec succes. Veuillez vous connecter.',
    registerErrorMessage: 'Impossible de creer le compte. Veuillez reessayer.',
    registerErrorToast: 'Echec de l\'inscription. Veuillez reessayer.',
    dashboardTitle: 'Tableau de bord',
    dashboardSubtitle: 'Articles recents',
    dashboardRecentPosts: 'Tous les articles',
    dashboardViewAllText: 'Voir tout →',
    dashboardViewAllAriaLabel: 'Voir tous les articles',
    dashboardViewPostPrefix: 'Voir l\'article :',
    dashboardCoverAltPrefix: 'Image de couverture pour',
    dashboardCategoryLabel: 'Categorie',
    dashboardEmptyText: 'Aucun article pour le moment',
    dashboardLoadError: 'Impossible de charger les articles recents.',
    dashboardStatsTotalLabel: 'Total',
    dashboardStatsEventsLabel: 'Evenements',
    dashboardStatsAnnouncementsLabel: 'Annonces',
    dashboardStatsNewsLabel: 'Actualites',
    dashboardUsersTitle: 'Utilisateurs',
    dashboardUsersCountSuffix: 'utilisateurs',
    dashboardUsersLoading: 'Chargement des utilisateurs...',
    dashboardUsersEmpty: 'Aucun utilisateur trouve.',
    dashboardUsersError: 'Impossible de charger les utilisateurs.',
    dashboardUsersRestricted: 'Acces admin requis pour voir les utilisateurs.',
    dashboardUsersNameLabel: 'Nom',
    dashboardUsersEmailLabel: 'E-mail',
    dashboardUsersRoleLabel: 'Role',
    dashboardUsersJoinedLabel: 'Inscription',
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
    postsCreateAriaLabel: 'Creer un nouvel article',
    postsCoverAltPrefix: 'Image de couverture pour',
    postsCategoryLabel: 'Categorie',
    postsMetaLabel: 'Metadonnees de l\'article',
    postsTimeLabel: 'Heure',
    postsLocationLabel: 'Lieu',
    postsViewDetailsText: 'Voir les details',
    postsViewDetailsPrefix: 'Voir les details pour',
    postsActionsLabel: 'Actions de l\'article',
    postsEditPrefix: 'Modifier',
    postsDeletePrefix: 'Supprimer',
    postsEmptyText: 'Aucun article. Creez votre premier article !',
    postsCreateFirstAriaLabel: 'Creer votre premier article',
    postsCreateFirstButton: 'Creer un article',
    postsPaginationLabel: 'Pagination des articles',
    postsPrevAriaLabel: 'Aller a la page precedente',
    postsPrevText: 'Precedent',
    postsNextAriaLabel: 'Aller a la page suivante',
    postsNextText: 'Suivant',
    postsPageLabel: 'Page',
    postsOfText: 'sur',
    postsCountSuffix: 'articles',
    postsLoadError: 'Impossible de charger les articles. Veuillez reessayer.',
    postsDeleteTitle: 'Supprimer l\'article',
    postsDeleteMessage: 'Voulez-vous vraiment supprimer cet article ? Cette action est irreversible.',
    postsDeleteConfirm: 'Supprimer',
    commonCancel: 'Annuler',
    postsDeleteSuccess: 'Article supprime avec succes',
    postsDeleteError: 'Echec de la suppression de l\'article',
    postsRemoveFilterLabel: 'Retirer le filtre :',
    postsImageFallbackText: 'Image non disponible',
    postsPublishTitle: 'Publier l\'article',
    postsPublishMessage: 'Voulez-vous vraiment publier "{title}" ? Une fois publie, il sera visible par tous les utilisateurs.',
    postsPublishConfirm: 'Publier',
    postsSubmitReviewTitle: 'Soumettre pour validation',
    postsSubmitReviewMessage: 'Soumettre "{title}" pour validation ? Un admin devra l\'approuver avant publication.',
    postsSubmitReviewConfirm: 'Soumettre',
    postsPublishSuccess: 'Article publie avec succes',
    postsPublishError: 'Echec de la publication de l\'article',
    postsSubmitReviewSuccess: 'Article soumis pour validation',
    postsSubmitReviewError: 'Echec de la soumission pour validation',
    postsDraftSuccess: 'Le statut est passe en brouillon',
    postsStatusChangeError: 'Echec du changement de statut',
    postDetailBack: '« Retour aux articles',
    postDetailEdit: 'Modifier l\'article',
    postDetailDelete: 'Supprimer',
    postDetailExternalLink: '🔗 Lien externe',
    postDetailShownHome: '✓ Affiche sur la page d\'accueil',
    postDetailShownRegistration: '✓ Affiche a l\'inscription',
    postDetailCreated: 'Cree :',
    postDetailUpdated: 'Mis a jour :',
    postDetailNotFound: 'Article introuvable',
    postDetailGoBack: 'Retour',
    postDetailLoadError: 'Impossible de charger l\'article',
    postFormBack: '« Retour',
    postFormEditTitle: 'Modifier l\'article',
    postFormNewTitle: 'Nouvel article',
    postFormCategoryLabel: 'Categorie',
    postFormCategoryEvent: 'Evenement',
    postFormCategoryAnnouncement: 'Annonce',
    postFormCategoryNews: 'Actualites',
    postFormTitleLabel: 'Titre',
    postFormTitlePlaceholder: 'Saisissez le titre de l\'article',
    postFormImageUrlLabel: 'URL de l\'image',
    postFormImagePlaceholder: 'https://exemple.com/image.jpg',
    postFormImagePreviewAlt: 'Apercu',
    postFormExcerptLabel: 'Extrait',
    postFormExcerptPlaceholder: 'Description breve...',
    postFormContentLabel: 'Contenu',
    postFormContentPlaceholder: 'Ecrivez le contenu de votre article ici...',
    postFormDateLabel: 'Date',
    postFormTimeLabel: 'Heure',
    postFormTimePlaceholder: '14:00',
    postFormLocationLabel: 'Lieu (optionnel)',
    postFormLocationPlaceholder: 'Lieu de l\'evenement',
    postFormExternalLinkLabel: 'Lien externe (optionnel)',
    postFormExternalLinkPlaceholder: 'https://exemple.com',
    postFormShowHome: 'Afficher sur la page d\'accueil',
    postFormShowRegistration: 'Afficher a l\'inscription',
    postFormCancel: 'Annuler',
    postFormUpdate: 'Mettre a jour',
    postFormPublish: 'Publier',
    postFormNotFound: 'Article introuvable',
    postFormLoadError: 'Impossible de charger l\'article',
    postFormAuthRequired: 'Vous devez etre connecte pour creer un article',
    postFormUpdateSuccess: 'Article mis a jour avec succes',
    postFormCreateSuccess: 'Article cree avec succes',
    postFormSaveError: 'Echec de l\'enregistrement. Veuillez reessayer.',
    commonNotAvailable: 'N/A',
    settingsTitle: 'Parametres',
    settingsProfileTitle: 'Informations du profil',
    settingsAccountTitle: 'Informations du compte',
    settingsAvatarAlt: 'Avatar',
    settingsProfilePictureLabel: 'Photo de profil',
    settingsAvatarPlaceholder: 'URL de l\'avatar',
    settingsFullNameLabel: 'Nom complet',
    settingsEmailLabel: 'Adresse e-mail',
    settingsSaveChanges: 'Enregistrer les modifications',
    settingsUserIdLabel: 'ID utilisateur',
    settingsRoleLabel: 'Role',
    settingsMemberSinceLabel: 'Membre depuis',
    settingsProfileUpdatedToast: 'Profil mis a jour avec succes',
    placeholderTitle: 'Bientot disponible',
    placeholderSubtitle: 'Cette fonctionnalite est en cours de developpement',
    sidebarTitle: 'Administration Conseil d\'Etat',
    sidebarCloseLabel: 'Fermer le menu de navigation',
    sidebarNavDashboard: 'Tableau de bord',
    sidebarNavPosts: 'Articles',
    sidebarNavUsers: 'Utilisateurs',
    sidebarNavAudit: 'Journal d\'audit',
    sidebarNavSettings: 'Parametres',
    sidebarLogoutLabel: 'Se deconnecter',
    sidebarLogoutTitle: 'Deconnexion',
    sidebarLogoutMessage: 'Voulez-vous vraiment vous deconnecter ?',
    sidebarLogoutConfirm: 'Se deconnecter',
    sidebarNavAriaLabel: 'Navigation principale',
    auditLogTitle: 'Journal d\'audit',
    auditLogSubtitle: 'Suivi des actions admin pour conformite et controle',
    auditLogSearchLabel: 'Recherche',
    auditLogSearchPlaceholder: 'Rechercher dans le journal',
    auditLogActionLabel: 'Action',
    auditLogActionAll: 'Toutes les actions',
    auditLogActionLogin: 'Connexion',
    auditLogActionRegister: 'Inscription',
    auditLogActionRoleUpdated: 'Role mis a jour',
    auditLogActionLockUpdated: 'Verrou mis a jour',
    auditLogActionPasswordReset: 'Mot de passe reinitialise',
    auditLogActionPostCreated: 'Article cree',
    auditLogActionPostUpdated: 'Article mis a jour',
    auditLogActionPostDeleted: 'Article supprime',
    auditLogEntityLabel: 'Entite',
    auditLogEntityAll: 'Toutes les entites',
    auditLogEntityUser: 'Utilisateur',
    auditLogEntityPost: 'Article',
    auditLogEntityAuth: 'Auth',
    auditLogActorLabel: 'Auteur',
    auditLogActorPlaceholder: 'Email admin ou ID',
    auditLogFromLabel: 'Du',
    auditLogToLabel: 'Au',
    auditLogResetFilters: 'Reinitialiser',
    auditLogLoading: 'Chargement du journal...',
    auditLogEmpty: 'Aucune activite pour le moment.',
    auditLogLoadError: 'Impossible de charger le journal.',
    auditLogTableTime: 'Heure',
    auditLogTableActor: 'Auteur',
    auditLogTableAction: 'Action',
    auditLogTableEntity: 'Entite',
    auditLogTableIp: 'IP',
    auditLogTableDetails: 'Details',
    auditLogCountSuffix: 'evenements',
    auditLogPaginationLabel: 'Pagination du journal',
    auditLogPrevText: 'Precedent',
    auditLogNextText: 'Suivant',
    auditLogPageLabel: 'Page',
    auditLogOfText: 'sur',
    headerGreetingPrefix: 'Bonjour',
    headerGuestName: 'Invite',
    headerThemeLabel: 'Theme',
    headerLanguageLabel: 'Langue',
    headerMenuToggleLabel: 'Basculer le menu de navigation'
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
