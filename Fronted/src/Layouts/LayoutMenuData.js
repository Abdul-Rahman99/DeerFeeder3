import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

 
const Navdata = () => {
    const history = useNavigate();
  

    
    //state data
    const [isDashboard, setIsDashboard] = useState(false);
    const [isBirdAnalysis, setIsBirdAnalysis] = useState(false);
    const [isAdminTools, setIsAdminTools] = useState(false);
    const [isSensorsAnalysis, setIsSensorsAnalysis] = useState(false);
    const [isFeedSetting, setIsFeedSetting] = useState(false);
    const [isFeedReport, setIsFeedReport] = useState(false);
    const [isBirdDetector, setIsBirdDetector] = useState(false);
    const [isApps, setIsApps] = useState(false);
    const [isDevices, setIsDevices] = useState(false);
    const [isFeed, setIsFeed] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [isPages, setIsPages] = useState(false);
    const [isBaseUi, setIsBaseUi] = useState(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState(false);
    const [isForms, setIsForms] = useState(false);
    const [isTables, setIsTables] = useState(false);
    const [isCharts, setIsCharts] = useState(false);
    const [isIcons, setIsIcons] = useState(false);
    const [isMaps, setIsMaps] = useState(false);
    const [isMultiLevel, setIsMultiLevel] = useState(false);

    // Apps
    const [isEmail, setEmail] = useState(false);
    const [isSubEmail, setSubEmail] = useState(false);
    const [isEcommerce, setIsEcommerce] = useState(false);
    const [isProjects, setIsProjects] = useState(false);
    const [isTasks, setIsTasks] = useState(false);
    const [isCRM, setIsCRM] = useState(false);
    const [isCrypto, setIsCrypto] = useState(false);
    const [isInvoices, setIsInvoices] = useState(false);
    const [isSupportTickets, setIsSupportTickets] = useState(false);
    const [isNFTMarketplace, setIsNFTMarketplace] = useState(false);
    const [isJobs, setIsJobs] = useState(false);
    const [isJobList, setIsJobList] = useState(false);
    const [isCandidateList, setIsCandidateList] = useState(false);


    // Authentication
    const [isSignIn, setIsSignIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [isPasswordCreate, setIsPasswordCreate] = useState(false);
    const [isLockScreen, setIsLockScreen] = useState(false);
    const [isLogout, setIsLogout] = useState(false);
    const [isSuccessMessage, setIsSuccessMessage] = useState(false);
    const [isVerification, setIsVerification] = useState(false);
    const [isError, setIsError] = useState(false);

    // Pages
    const [isProfile, setIsProfile] = useState(false);
    const [isLanding, setIsLanding] = useState(false);


    // Charts
    const [isApex, setIsApex] = useState(false);

    // Multi Level
    const [isLevel1, setIsLevel1] = useState(false);
    const [isLevel2, setIsLevel2] = useState(false);

    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    // const userData = JSON.parse(localStorage.getItem('userData'));
    // const userId = userData.id;


    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    useEffect(() => {
        
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Bird Analysis') {
            setIsBirdAnalysis(false);
        }
        if (iscurrentState !== 'Administration') {
            setIsAdminTools(false);
        }
        if (iscurrentState !== 'Sensors Analysis') {
            setIsSensorsAnalysis(false);
        }
        if (iscurrentState !== 'Feed Setting') {
            setIsFeedSetting(false);
        }
        if (iscurrentState !== 'Feed Report') {
            setIsFeedReport(false);
        }
        if (iscurrentState !== 'Bird Detector') {
            setIsBirdDetector(false);
        }
        if (iscurrentState !== 'Devices') {
            setIsDevices(false);
        }
        if (iscurrentState !== 'Feed') {
            setIsFeed(false);
        }
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }
        if (iscurrentState !== 'MuliLevel') {
            setIsMultiLevel(false);
        }
        if (iscurrentState === 'Widgets') {
            history("/widgets");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState !== 'Landing') {
            setIsLanding(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isBirdAnalysis,
        isAdminTools,
        isFeedSetting,
        isSensorsAnalysis,
        isDevices,
        isFeed,
        isApps,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel
    ]);
   

    const menuItems = [
        {
            label: "Bird Feeding Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "ri-dashboard-2-line",
            link: "/dashboard",
            stateVariables: isDashboard,
            click: function (e) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
        },
        {
      		id: "birdanalysis",
      		label: "Birds Reports",
      		icon: "ri-file-list-line",
      		link: "https://mngar.ae:3003",
      		stateVariables: isBirdAnalysis,
      		click: function (e) {
        	e.preventDefault();
        	setIsBirdAnalysis(!isBirdAnalysis);
        	setIscurrentState("Bird Analysis");
        	updateIconSidebar(e);
      	     },
    	},
        {
            id: "admintools",
            label: "Administration",
            icon: "ri-settings-3-fill",
            link: "/#",
            click: function (e) {
                e.preventDefault();
                setIsAdminTools(!isAdminTools);
                setIscurrentState('Administration');
                updateIconSidebar(e);
            },
            stateVariables: isAdminTools,

            
            subItems: [
                { id: 1, label: "Manage Users", link: "/manage-users", parentId: "admintools" },
               // { id: 1, label: "Manage User Types", link: "/manage-usertypes", parentId: "admintools" },
                { id: 1, label: "Manage Roles", link: "/manage-roles", parentId: "admintools" },
                { id: 2, label: "Manage Permissions", link: "/manage-permissions", parentId: "admintools" },
                { id: 3, label: "Manage User Roles", link: "/user-roles", parentId: "admintools" },
                { id: 4, label: "Manage Feeding Devices", link: "/bird-feeding-devices", parentId: "admintools" },
                { id: 5, label: "Manage Birds", link: "/manage-birds", parentId: "admintools" },
            ]
        },
        
        // {
        //     id: "sensorsanalysis",
        //     label: "Sensors Analysis",
        //     icon: "ri-tools-fill",
        //     link: "/sensors-analysis",
        //     stateVariables: isSensorsAnalysis,
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsSensorsAnalysis(!isSensorsAnalysis);
        //         setIscurrentState('Sensors Analysis');
        //         updateIconSidebar(e);
        //     },
        // },
        // {
        //     id: "feedsetting",
        //     label: "Feed Setting (Test)",
        //     icon: "ri-tools-fill",
        //     link: "/feed-setting",
        //     stateVariables: isFeedSetting,
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsFeedSetting(!isFeedSetting);
        //         setIscurrentState('Feed Setting');
        //         updateIconSidebar(e);
        //     },
        // },
        // {
        //     id: "birddetector",
        //     label: "Bird Detector",
        //     icon: "ri-quill-pen-line",
        //     link: "/bird-detector",
        //     stateVariables: isBirdDetector,
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsBirdDetector(!isBirdDetector);
        //         setIscurrentState('Bird Detector');
        //         updateIconSidebar(e);
        //     },
        // },
        // {
        //     id: "feedreport",
        //     label: "Feed Reports",
        //     icon: "ri-line-chart-line",
        //     link: "/feed-reports",
        //     stateVariables: isFeedReport,
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsFeedReport(!isFeedReport);
        //         setIscurrentState('Feed Report');
        //         updateIconSidebar(e);
        //     },
        // },
        // {
        //     id: "devices",
        //     label: "Devices",
        //     icon: "ri-smartphone-line",
        //     link: "/#",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsDevices(!isDevices);
        //         setIscurrentState('Devices');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isDevices,
        //     subItems: [
        //         {
        //             id: "commands",
        //             label: "All Commands",
        //             link: "/commands",
        //             parentId: "devices",
        //         },
        //         {
        //             id: "chat",
        //             label: "Chat",
        //             link: "/apps-chat",
        //             parentId: "devices",
        //         },
        //     ]
        // },
        // {
        //     id: "birds",
        //     label: "Birds",
        //     icon: "ri-quill-pen-line",
        //     link: "/dashboard",
        //     stateVariables: isDashboard,
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsDashboard(!isDashboard);
        //         setIscurrentState('Birds');
        //         updateIconSidebar(e);
        //     },
        // },
        // {
        //     id: "settings",
        //     label: "Settings",
        //     icon: "ri-settings-3-fill",
        //     link: "/dashboard",
        //     stateVariables: isDashboard,
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsDashboard(!isDashboard);
        //         setIscurrentState('Settings');
        //         updateIconSidebar(e);
        //     },
        // },


        // {
        //     label: "pages",
        //     isHeader: true,
        // },



        // {
        //     id: "authentication",
        //     label: "Authentication",
        //     icon: "ri-account-circle-line",
        //     link: "/#",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsAuth(!isAuth);
        //         setIscurrentState('Auth');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isAuth,
        //     subItems: [
        //         {
        //             id: "signIn",
        //             label: "Sign In",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsSignIn(!isSignIn);
        //             },
        //             parentId: "authentication",
        //             stateVariables: isSignIn,
        //             childItems: [
        //                 { id: 1, label: "Basic", link: "/auth-signin-basic" },
        //                 { id: 2, label: "Cover", link: "/auth-signin-cover" },
        //             ]
        //         },
        //         {
        //             id: "signUp",
        //             label: "Sign Up",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsSignUp(!isSignUp);
        //             },
        //             parentId: "authentication",
        //             stateVariables: isSignUp,
        //             childItems: [
        //                 { id: 1, label: "Basic", link: "/auth-signup-basic" },
        //                 { id: 2, label: "Cover", link: "/auth-signup-cover" },
        //             ]
        //         },
        //         {
        //             id: "passwordReset",
        //             label: "Password Reset",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsPasswordReset(!isPasswordReset);
        //             },
        //             parentId: "authentication",
        //             stateVariables: isPasswordReset,
        //             childItems: [
        //                 { id: 1, label: "Basic", link: "/auth-pass-reset-basic" },
        //                 { id: 2, label: "Cover", link: "/auth-pass-reset-cover" },
        //             ]
        //         },
        //         {
        //             id: "passwordCreate",
        //             label: "Password Create",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsPasswordCreate(!isPasswordCreate);
        //             },
        //             parentId: "authentication",
        //             stateVariables: isPasswordCreate,
        //             childItems: [
        //                 { id: 1, label: "Basic", link: "/auth-pass-change-basic" },
        //                 { id: 2, label: "Cover", link: "/auth-pass-change-cover" },
        //             ]
        //         },
        //         {
        //             id: "lockScreen",
        //             label: "Lock Screen",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsLockScreen(!isLockScreen);
        //             },
        //             parentId: "authentication",
        //             stateVariables: isLockScreen,
        //             childItems: [
        //                 { id: 1, label: "Basic", link: "/auth-lockscreen-basic" },
        //                 { id: 2, label: "Cover", link: "/auth-lockscreen-cover" },
        //             ]
        //         },
        //         {
        //             id: "logout",
        //             label: "Logout",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsLogout(!isLogout);
        //             },
        //             parentId: "authentication",
        //             stateVariables: isLogout,
        //             childItems: [
        //                 { id: 1, label: "Basic", link: "/auth-logout-basic" },
        //                 { id: 2, label: "Cover", link: "/auth-logout-cover" },
        //             ]
        //         },
        //         {
        //             id: "successMessage",
        //             label: "Success Message",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsSuccessMessage(!isSuccessMessage);
        //             },
        //             parentId: "authentication",
        //             stateVariables: isSuccessMessage,
        //             childItems: [
        //                 { id: 1, label: "Basic", link: "/auth-success-msg-basic" },
        //                 { id: 2, label: "Cover", link: "/auth-success-msg-cover" },
        //             ]
        //         },
        //         {
        //             id: "twoStepVerification",
        //             label: "Two Step Verification",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsVerification(!isVerification);
        //             },
        //             parentId: "authentication",
        //             stateVariables: isVerification,
        //             childItems: [
        //                 { id: 1, label: "Basic", link: "/auth-twostep-basic" },
        //                 { id: 2, label: "Cover", link: "/auth-twostep-cover" },
        //             ]
        //         },
        //         {
        //             id: "errors",
        //             label: "Errors",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e) {
        //                 e.preventDefault();
        //                 setIsError(!isError);
        //             },
        //             parentId: "authentication",
        //             stateVariables: isError,
        //             childItems: [
        //                 { id: 1, label: "404 Basic", link: "/auth-404-basic" },
        //                 { id: 2, label: "404 Cover", link: "/auth-404-cover" },
        //                 { id: 3, label: "404 Alt", link: "/auth-404-alt" },
        //                 { id: 4, label: "500", link: "/auth-500" },
        //                 { id: 5, label: "Offline Page", link: "/auth-offline" },
        //             ]
        //         },
        //     ],
        // },

        // {
        //     id: "tables",
        //     label: "Tables",
        //     icon: "ri-layout-grid-line",
        //     link: "/#",
        //     click: function (e) {
        //         e.preventDefault();
        //         setIsTables(!isTables);
        //         setIscurrentState('Tables');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isTables,
        //     subItems: [
        //         { id: "basictables", label: "Basic Tables", link: "/tables-basic", parentId: "tables" },
        //         { id: "listjs", label: "List Js", link: "/tables-listjs", parentId: "tables" },
        //         { id: "reactdatatables", label: "React Datatables", link: "/tables-react", parentId: "tables" },
        //     ],
        // },

    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
