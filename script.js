// ===========================================
// 전역 변수 및 상수
// ===========================================

let todos = [];
let todoIdCounter = 1;
let currentDate = new Date();
let selectedDateFilter = null;
let currentView = 'week';
let currentFilters = {
    search: '',
    category: '',
    status: '',
    sort: 'date'
};
let isDarkMode = false;
let draggedElement = null;
let currentLanguage = 'ko';
let isNotificationsEnabled = false;
let customCategories = [];

// 성능 최적화 변수
let isVirtualScrollEnabled = true;
let virtualScrollOffset = 0;
let virtualScrollLimit = 50;
let lastScrollTime = 0;
let scrollThrottle = 16; // 60fps

// 모바일 터치 변수
let touchStartX = 0;
let touchStartY = 0;
let isTouchDevice = false;
let gestureTimeout = null;

// 알림 관련 변수
let notificationPermission = 'default';
let notificationWorker = null;
let pendingNotifications = [];

// ===========================================
// 다국어 지원 시스템
// ===========================================

const translations = {
    ko: {
        app: {
            title: '✨ 할 일 관리 Pro ✨',
            subtitle: '효율적인 일상 관리 💼'
        },
        search: {
            placeholder: '할 일 검색... 🔍'
        },
        todo: {
            input_placeholder: '할 일을 입력하세요 📝',
            category: '카테고리:',
            priority: '우선순위:',
            due_date: '마감일:',
            reminder: '알림:',
            drag_guide: '📋 드래그해서 순서를 변경하세요'
        },
        categories: {
            personal: '🙋‍♂️ 개인',
            work: '💼 업무',
            hobby: '🎨 취미',
            health: '💪 건강',
            study: '📚 학습',
            shopping: '🛒 쇼핑',
            travel: '✈️ 여행',
            family: '👨‍👩‍👧‍👦 가족',
            custom: '⚙️ 커스텀',
            custom_placeholder: '새 카테고리 입력'
        },
        priority: {
            urgent: '🔥 긴급',
            high: '🔴 높음',
            medium: '🟡 보통',
            normal: '🟢 일반',
            low: '🔵 낮음'
        },
        reminder: {
            none: '없음',
            '10min': '10분 전',
            '30min': '30분 전',
            '1hour': '1시간 전',
            '1day': '1일 전'
        },
        filters: {
            category: '카테고리:',
            status: '상태:',
            sort: '정렬:',
            all: '전체',
            quick: '빠른 필터:',
            today: '오늘',
            urgent: '긴급',
            overdue: '지연'
        },
        status: {
            pending: '진행중',
            completed: '완료',
            overdue: '지연'
        },
        sort: {
            date: '날짜순',
            priority: '우선순위',
            category: '카테고리',
            due_date: '마감일',
            manual: '수동정렬'
        },
        stats: {
            total: '전체',
            completed: '완료',
            pending: '진행중',
            overdue: '지연'
        },
        dashboard: {
            title: '📊 상세 통계',
            overview: '개요',
            charts: '차트',
            trends: '트렌드',
            productivity: '생산성',
            progress: '진행률',
            today: '오늘 할 일',
            category_distribution: '카테고리별 분포',
            trends_summary: '트렌드 요약'
        },
        chart: {
            week: '이번 주',
            month: '이번 달',
            year: '올해'
        },
        productivity: {
            avg_completion: '평균 완료율:',
            best_day: '최고 생산성 요일:',
            streak: '연속 달성일:'
        },
        calendar: {
            week: '주간',
            month: '월간',
            year: '연간',
            today: '오늘',
            all_todos: '전체 할 일'
        },
        weekdays: {
            sun: '일',
            mon: '월',
            tue: '화',
            wed: '수',
            thu: '목',
            fri: '금',
            sat: '토'
        },
        empty: {
            no_todos: '등록된 할 일이 없습니다!',
            add_todo: '위에서 새로운 할 일을 추가해보세요 ✨'
        },
        loading: {
            app_title: '할 일 관리 Pro',
            initializing: '앱을 초기화하는 중...',
            more_todos: '더 많은 할 일을 불러오는 중...'
        },
        notifications: {
            permission_title: '📢 알림 권한',
            permission_message: '마감일과 중요한 할 일 알림을 받으시겠습니까?',
            allow: '허용',
            deny: '나중에',
            due_soon: '곧 마감되는 할 일이 있습니다',
            overdue: '마감일이 지난 할 일이 있습니다'
        },
        footer: {
            message: '효율적인 하루 되세요! 💪',
            export: '📤 내보내기',
            import: '📥 가져오기',
            clear_all: '🗑️ 전체 삭제'
        }
    },
    en: {
        app: {
            title: '✨ Todo Manager Pro ✨',
            subtitle: 'Efficient Daily Management 💼'
        },
        search: {
            placeholder: 'Search todos... 🔍'
        },
        todo: {
            input_placeholder: 'Enter your todo 📝',
            category: 'Category:',
            priority: 'Priority:',
            due_date: 'Due Date:',
            reminder: 'Reminder:',
            drag_guide: '📋 Drag to reorder'
        },
        categories: {
            personal: '🙋‍♂️ Personal',
            work: '💼 Work',
            hobby: '🎨 Hobby',
            health: '💪 Health',
            study: '📚 Study',
            shopping: '🛒 Shopping',
            travel: '✈️ Travel',
            family: '👨‍👩‍👧‍👦 Family',
            custom: '⚙️ Custom',
            custom_placeholder: 'Enter new category'
        },
        priority: {
            urgent: '🔥 Urgent',
            high: '🔴 High',
            medium: '🟡 Medium',
            normal: '🟢 Normal',
            low: '🔵 Low'
        },
        reminder: {
            none: 'None',
            '10min': '10 minutes before',
            '30min': '30 minutes before',
            '1hour': '1 hour before',
            '1day': '1 day before'
        },
        filters: {
            category: 'Category:',
            status: 'Status:',
            sort: 'Sort:',
            all: 'All',
            quick: 'Quick Filters:',
            today: 'Today',
            urgent: 'Urgent',
            overdue: 'Overdue'
        },
        status: {
            pending: 'Pending',
            completed: 'Completed',
            overdue: 'Overdue'
        },
        sort: {
            date: 'Date',
            priority: 'Priority',
            category: 'Category',
            due_date: 'Due Date',
            manual: 'Manual'
        },
        stats: {
            total: 'Total',
            completed: 'Completed',
            pending: 'Pending',
            overdue: 'Overdue'
        },
        dashboard: {
            title: '📊 Detailed Statistics',
            overview: 'Overview',
            charts: 'Charts',
            trends: 'Trends',
            productivity: 'Productivity',
            progress: 'Progress',
            today: 'Today\'s Tasks',
            category_distribution: 'Category Distribution',
            trends_summary: 'Trends Summary'
        },
        chart: {
            week: 'This Week',
            month: 'This Month',
            year: 'This Year'
        },
        productivity: {
            avg_completion: 'Avg Completion:',
            best_day: 'Best Productivity Day:',
            streak: 'Current Streak:'
        },
        calendar: {
            week: 'Week',
            month: 'Month',
            year: 'Year',
            today: 'Today',
            all_todos: 'All Todos'
        },
        weekdays: {
            sun: 'Sun',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            fri: 'Fri',
            sat: 'Sat'
        },
        empty: {
            no_todos: 'No todos yet!',
            add_todo: 'Add your first todo above ✨'
        },
        loading: {
            app_title: 'Todo Manager Pro',
            initializing: 'Initializing app...',
            more_todos: 'Loading more todos...'
        },
        notifications: {
            permission_title: '📢 Notification Permission',
            permission_message: 'Would you like to receive notifications for due dates and important tasks?',
            allow: 'Allow',
            deny: 'Later',
            due_soon: 'You have tasks due soon',
            overdue: 'You have overdue tasks'
        },
        footer: {
            message: 'Have a productive day! 💪',
            export: '📤 Export',
            import: '📥 Import',
            clear_all: '🗑️ Clear All'
        }
    }
};

// ===========================================
// 대한민국 공휴일 데이터 (확장됨)
// ===========================================

const koreanHolidays = {
    '2024': {
        '01-01': '신정',
        '02-09': '설날 연휴',
        '02-10': '설날',
        '02-11': '설날 연휴',
        '02-12': '설날 대체공휴일',
        '03-01': '삼일절',
        '05-05': '어린이날',
        '05-06': '어린이날 대체공휴일',
        '05-15': '부처님 오신날',
        '06-06': '현충일',
        '08-15': '광복절',
        '09-16': '추석 연휴',
        '09-17': '추석',
        '09-18': '추석 연휴',
        '10-03': '개천절',
        '10-09': '한글날',
        '12-25': '성탄절'
    },
    '2025': {
        '01-01': '신정',
        '01-28': '설날 연휴',
        '01-29': '설날',
        '01-30': '설날 연휴',
        '03-01': '삼일절',
        '05-05': '어린이날',
        '05-06': '부처님 오신날',
        '06-06': '현충일',
        '08-15': '광복절',
        '09-06': '추석 연휴',
        '09-07': '추석',
        '09-08': '추석 연휴',
        '10-03': '개천절',
        '10-09': '한글날',
        '12-25': '성탄절'
    },
    '2026': {
        '01-01': '신정',
        '02-16': '설날 연휴',
        '02-17': '설날',
        '02-18': '설날 연휴',
        '03-01': '삼일절',
        '05-05': '어린이날',
        '05-24': '부처님 오신날',
        '06-06': '현충일',
        '08-15': '광복절',
        '09-25': '추석 연휴',
        '09-26': '추석',
        '09-27': '추석 연휴',
        '10-03': '개천절',
        '10-09': '한글날',
        '12-25': '성탄절'
    },
    '2027': {
        '01-01': '신정',
        '02-06': '설날 연휴',
        '02-07': '설날',
        '02-08': '설날 연휴',
        '03-01': '삼일절',
        '05-05': '어린이날',
        '05-13': '부처님 오신날',
        '06-06': '현충일',
        '08-15': '광복절',
        '10-03': '개천절',
        '10-09': '한글날',
        '10-14': '추석 연휴',
        '10-15': '추석',
        '10-16': '추석 연휴',
        '12-25': '성탄절'
    }
};

// ===========================================
// 공휴일 및 유틸리티 함수들
// ===========================================

function isKoreanHoliday(date) {
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    return koreanHolidays[year] && koreanHolidays[year][dateKey];
}

function getHolidayName(date) {
    const year = date.getFullYear().toString();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    return koreanHolidays[year] ? koreanHolidays[year][dateKey] : null;
}

function checkHolidayDataCoverage() {
    const currentYear = new Date().getFullYear();
    const availableYears = Object.keys(koreanHolidays).map(Number);
    const minYear = Math.min(...availableYears);
    const maxYear = Math.max(...availableYears);
    
    if (currentYear < minYear || currentYear > maxYear) {
        console.warn(`⚠️ ${currentYear}년 공휴일 데이터가 없습니다. 공휴일 데이터 업데이트가 필요합니다.`);
        return false;
    }
    return true;
}

function getDetailedHolidayInfo(date) {
    const holidayName = getHolidayName(date);
    if (!holidayName) return null;
    
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[date.getDay()];
    
    return {
        name: holidayName,
        dayName: dayName,
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        formatted: `${holidayName} (${dayName}요일)`
    };
}

function getYearlyHolidayStats(year) {
    const holidays = koreanHolidays[year.toString()];
    if (!holidays) return null;
    
    const stats = {
        total: Object.keys(holidays).length,
        weekdays: 0,
        weekends: 0,
        byMonth: {}
    };
    
    Object.entries(holidays).forEach(([dateKey, name]) => {
        const [month, day] = dateKey.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            stats.weekends++;
        } else {
            stats.weekdays++;
        }
        
        if (!stats.byMonth[month]) {
            stats.byMonth[month] = [];
        }
        stats.byMonth[month].push({ day, name, dayOfWeek });
    });
    
    return stats;
}

function createHolidayTooltip(date) {
    const holidayInfo = getDetailedHolidayInfo(date);
    if (!holidayInfo) return '';
    
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let timeInfo = '';
    if (diffDays === 0) {
        timeInfo = ' (오늘)';
    } else if (diffDays === 1) {
        timeInfo = ' (내일)';
    } else if (diffDays === -1) {
        timeInfo = ' (어제)';
    } else if (diffDays > 0) {
        timeInfo = ` (${diffDays}일 후)`;
    } else {
        timeInfo = ` (${Math.abs(diffDays)}일 전)`;
    }
    
    return `🎌 ${holidayInfo.formatted}${timeInfo}`;
}

function applyHolidayStyles(dateEl, date) {
    if (isKoreanHoliday(date)) {
        dateEl.classList.add('korean-holiday');
        const tooltip = createHolidayTooltip(date);
        dateEl.setAttribute('title', tooltip);
        dateEl.setAttribute('aria-label', `${date.getDate()}일 - ${tooltip}`);
    }
}

function initializeHolidaySystem() {
    logHolidayInfo();
    checkHolidayDataCoverage();
    
    const currentYear = new Date().getFullYear();
    const stats = getYearlyHolidayStats(currentYear);
    if (stats) {
        console.log(`📊 ${currentYear}년 공휴일 통계:`, stats);
        console.log(`   - 총 공휴일: ${stats.total}개`);
        console.log(`   - 평일 공휴일: ${stats.weekdays}개`);
        console.log(`   - 주말 공휴일: ${stats.weekends}개`);
    }
}

function logHolidayInfo() {
    const currentYear = new Date().getFullYear();
    const availableYears = Object.keys(koreanHolidays);
    console.log(`🎌 대한민국 공휴일 데이터 로드됨: ${availableYears.join(', ')}년`);
    
    if (availableYears.includes(currentYear.toString())) {
        const thisYearHolidays = Object.entries(koreanHolidays[currentYear]).length;
        console.log(`📅 ${currentYear}년 공휴일: ${thisYearHolidays}개`);
    } else {
        console.log(`⚠️ ${currentYear}년 공휴일 데이터가 없습니다. 업데이트가 필요합니다.`);
    }
}

// ===========================================
// 다국어 지원 함수들
// ===========================================

function t(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        if (value && typeof value === 'object') {
            value = value[k];
        } else {
            value = undefined;
            break;
        }
    }
    
    return value || key;
}

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
    
    // HTML lang 속성 업데이트
    document.documentElement.lang = currentLanguage;
    
    // 설정 저장
    saveSettings();
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'ko' ? 'en' : 'ko';
    updateLanguage();
    
    // 달력 다시 렌더링 (요일 이름 때문에)
    updateCalendarView();
    
    announceStatus(currentLanguage === 'ko' ? '한국어로 변경되었습니다' : 'Changed to English');
}

// ===========================================
// 알림 시스템
// ===========================================

async function initializeNotifications() {
    try {
        // 알림 권한 상태 확인
        if ('Notification' in window) {
            notificationPermission = Notification.permission;
            
            if (notificationPermission === 'default') {
                showNotificationPermissionModal();
            } else if (notificationPermission === 'granted') {
                isNotificationsEnabled = true;
                setupNotificationWorker();
            }
        } else {
            console.log('브라우저가 알림을 지원하지 않습니다.');
        }
    } catch (error) {
        console.error('알림 초기화 중 오류:', error);
    }
}

function showNotificationPermissionModal() {
    const modal = document.getElementById('notificationModal');
    if (modal) {
        modal.classList.remove('hidden');
        
        const allowBtn = document.getElementById('allowNotifications');
        const denyBtn = document.getElementById('denyNotifications');
        
        if (allowBtn) {
            allowBtn.addEventListener('click', async () => {
                await requestNotificationPermission();
                modal.classList.add('hidden');
            });
        }
        
        if (denyBtn) {
            denyBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                localStorage.setItem('notificationPermissionAsked', 'true');
            });
        }
    }
}

async function requestNotificationPermission() {
    try {
        const permission = await Notification.requestPermission();
        notificationPermission = permission;
        
        if (permission === 'granted') {
            isNotificationsEnabled = true;
            setupNotificationWorker();
            showToast(t('notifications.allow'), '🔔');
        }
        
        saveSettings();
        updateNotificationToggleUI();
    } catch (error) {
        console.error('알림 권한 요청 중 오류:', error);
    }
}

function setupNotificationWorker() {
    // 주기적으로 알림 체크 (1분마다)
    if (notificationWorker) {
        clearInterval(notificationWorker);
    }
    
    notificationWorker = setInterval(checkPendingNotifications, 60000);
}

function checkPendingNotifications() {
    if (!isNotificationsEnabled) return;
    
    const now = new Date();
    const upcomingTasks = [];
    const overdueTasks = [];
    
    todos.forEach(todo => {
        if (todo.completed) return;
        
        // 마감일 체크
        if (todo.dueDate) {
            const dueDate = new Date(todo.dueDate);
            const timeDiff = dueDate.getTime() - now.getTime();
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            
            if (hoursDiff < 0) {
                overdueTasks.push(todo);
            } else if (hoursDiff <= 24 && hoursDiff > 0) {
                upcomingTasks.push(todo);
            }
        }
        
        // 리마인더 체크
        if (todo.reminder && todo.dueDate) {
            const dueDate = new Date(todo.dueDate);
            const reminderTime = new Date(dueDate.getTime() - (parseInt(todo.reminder) * 60 * 1000));
            
            if (now >= reminderTime && now < dueDate) {
                upcomingTasks.push(todo);
            }
        }
    });
    
    // 알림 표시
    if (overdueTasks.length > 0) {
        showNotification(
            t('notifications.overdue'),
            `${overdueTasks.length}개의 할 일이 마감일을 지났습니다.`,
            'overdue'
        );
    }
    
    if (upcomingTasks.length > 0) {
        showNotification(
            t('notifications.due_soon'),
            `${upcomingTasks.length}개의 할 일이 곧 마감됩니다.`,
            'upcoming'
        );
    }
}

function showNotification(title, body, type = 'info', actions = []) {
    if (!isNotificationsEnabled || notificationPermission !== 'granted') {
        return;
    }
    
    try {
        const notification = new Notification(title, {
            body: body,
            icon: getNotificationIcon(type),
            badge: '/icons/icon-192x192.png',
            tag: type,
            requireInteraction: true,
            actions: actions
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        // 5초 후 자동 닫기
        setTimeout(() => {
            notification.close();
        }, 5000);
        
    } catch (error) {
        console.error('알림 표시 중 오류:', error);
        // 폴백으로 토스트 표시
        showToast(title + ': ' + body, getNotificationEmoji(type));
    }
}

function getNotificationIcon(type) {
    switch (type) {
        case 'overdue': return '⚠️';
        case 'upcoming': return '⏰';
        case 'completed': return '✅';
        default: return '🔔';
    }
}

function getNotificationEmoji(type) {
    switch (type) {
        case 'overdue': return '⚠️';
        case 'upcoming': return '⏰';
        case 'completed': return '✅';
        default: return '🔔';
    }
}

function toggleNotifications() {
    if (notificationPermission === 'granted') {
        isNotificationsEnabled = !isNotificationsEnabled;
        
        if (isNotificationsEnabled) {
            setupNotificationWorker();
            showToast('알림이 활성화되었습니다', '🔔');
        } else {
            if (notificationWorker) {
                clearInterval(notificationWorker);
            }
            showToast('알림이 비활성화되었습니다', '🔕');
        }
        
        saveSettings();
        updateNotificationToggleUI();
    } else {
        showNotificationPermissionModal();
    }
}

function updateNotificationToggleUI() {
    const toggleBtn = document.getElementById('notificationToggle');
    if (toggleBtn) {
        if (isNotificationsEnabled && notificationPermission === 'granted') {
            toggleBtn.classList.add('has-notifications');
            toggleBtn.textContent = '🔔';
        } else {
            toggleBtn.classList.remove('has-notifications');
            toggleBtn.textContent = '🔕';
        }
    }
}

// ===========================================
// 토스트 알림 시스템
// ===========================================

function showToast(message, icon = '💬', duration = 3000) {
    const toast = document.getElementById('notificationToast');
    if (!toast) return;
    
    const iconEl = toast.querySelector('.toast-icon');
    const messageEl = toast.querySelector('.toast-message');
    const closeBtn = toast.querySelector('.toast-close');
    
    if (iconEl) iconEl.textContent = icon;
    if (messageEl) messageEl.textContent = message;
    
    toast.classList.remove('hidden');
    
    // 자동 닫기
    const autoClose = setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
    
    // 수동 닫기
    if (closeBtn) {
        closeBtn.onclick = () => {
            clearTimeout(autoClose);
            toast.classList.add('hidden');
        };
    }
}

// ===========================================
// 성능 최적화 함수들
// ===========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 가상 스크롤링 구현
function initializeVirtualScroll() {
    const container = document.getElementById('todoListContainer');
    if (!container) return;
    
    const handleScroll = throttle(() => {
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const totalHeight = container.scrollHeight;
        
        // 하단 근처에 도달했을 때 더 많은 항목 로드
        if (scrollTop + containerHeight >= totalHeight - 100) {
            loadMoreTodos();
        }
    }, scrollThrottle);
    
    container.addEventListener('scroll', handleScroll, { passive: true });
}

function loadMoreTodos() {
    if (virtualScrollOffset >= todos.length) return;
    
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.remove('hidden');
    }
    
    // 시뮬레이션된 로딩 지연
    setTimeout(() => {
        virtualScrollOffset += virtualScrollLimit;
        renderTodos();
        
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
    }, 500);
}

// 이미지 지연 로딩
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 메모리 사용량 모니터링
function monitorPerformance() {
    if ('memory' in performance) {
        const memory = performance.memory;
        console.log(`Memory Usage: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`);
        
        // 메모리 사용량이 50MB를 초과하면 경고
        if (memory.usedJSHeapSize > 50 * 1024 * 1024) {
            console.warn('높은 메모리 사용량 감지됨. 최적화가 필요할 수 있습니다.');
        }
    }
}

// ===========================================
// 모바일 최적화 함수들
// ===========================================

function initializeMobileOptimizations() {
    detectTouchDevice();
    setupTouchGestures();
    setupMobileKeyboard();
    setupMobileNavigation();
}

function detectTouchDevice() {
    isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
        
        // 터치 디바이스에서 hover 효과 최적화
        document.addEventListener('touchstart', function() {}, { passive: true });
    }
}

function setupTouchGestures() {
    const todoList = document.getElementById('todoList');
    if (!todoList) return;
    
    let startX, startY, startTime;
    
    todoList.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
        
        touchStartX = startX;
        touchStartY = startY;
    }, { passive: true });
    
    todoList.addEventListener('touchmove', (e) => {
        if (!startX || !startY) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        
        // 스와이프 제스처 감지
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            const todoItem = e.target.closest('.todo-item');
            if (todoItem) {
                // 스와이프 시각적 피드백
                todoItem.style.transform = `translateX(${deltaX * 0.5}px)`;
                todoItem.style.opacity = Math.max(0.3, 1 - Math.abs(deltaX) / 300);
            }
        }
    }, { passive: true });
    
    todoList.addEventListener('touchend', (e) => {
        if (!startX || !startY) return;
        
        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        const deltaTime = Date.now() - startTime;
        
        const todoItem = e.target.closest('.todo-item');
        if (todoItem) {
            // 원래 상태로 복원
            todoItem.style.transform = '';
            todoItem.style.opacity = '';
            
            // 스와이프 동작 처리
            if (Math.abs(deltaX) > 100 && deltaTime < 500) {
                const todoId = parseInt(todoItem.getAttribute('data-id'));
                
                if (deltaX > 0) {
                    // 오른쪽 스와이프: 완료 토글
                    toggleTodo(todoId);
                } else {
                    // 왼쪽 스와이프: 삭제
                    if (confirm(t('확실히 삭제하시겠습니까?'))) {
                        deleteTodoWithAnimation(todoId);
                    }
                }
            }
        }
        
        startX = null;
        startY = null;
    }, { passive: true });
}

function setupMobileKeyboard() {
    // 모바일 키보드 표시/숨김 감지
    let initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', debounce(() => {
        const currentHeight = window.innerHeight;
        const heightDifference = initialViewportHeight - currentHeight;
        
        if (heightDifference > 150) {
            // 키보드가 표시됨
            document.body.classList.add('keyboard-open');
        } else {
            // 키보드가 숨겨짐
            document.body.classList.remove('keyboard-open');
        }
    }, 100));
}

function setupMobileNavigation() {
    // 모바일에서 빠른 액세스 버튼들
    if (isTouchDevice) {
        addQuickActionButtons();
    }
}

function addQuickActionButtons() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    const quickActions = document.createElement('div');
    quickActions.className = 'quick-actions mobile-only';
    quickActions.innerHTML = `
        <button class="quick-action-btn" data-action="add" title="빠른 추가">➕</button>
        <button class="quick-action-btn" data-action="search" title="검색">🔍</button>
        <button class="quick-action-btn" data-action="today" title="오늘">📅</button>
        <button class="quick-action-btn" data-action="stats" title="통계">📊</button>
    `;
    
    container.appendChild(quickActions);
    
    // 빠른 액션 버튼 이벤트
    quickActions.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        
        switch (action) {
            case 'add':
                document.getElementById('todoInput')?.focus();
                break;
            case 'search':
                document.getElementById('searchInput')?.focus();
                break;
            case 'today':
                filterToday();
                break;
            case 'stats':
                toggleDashboard();
                break;
        }
    });
}

// ===========================================
// DOM 요소들
// ===========================================

let todoInput, addBtn, todoList, emptyState, totalTasks, completedTasks, pendingTasks;
let searchInput, clearSearchBtn, categorySelect, prioritySelect, dueDateInput, reminderSelect;
let categoryFilter, statusFilter, sortSelect, darkModeToggle, dashboardToggle;
let dashboard, closeDashboard, overdueTasks, dragGuide, statusUpdates;
let exportData, importBtn, importData, clearAllData;
let prevPeriodBtn, nextPeriodBtn, currentPeriodEl, weekGrid, monthGrid, yearGrid;
let todayBtn, selectedDateEl, weekViewContainer, monthViewContainer, yearViewContainer;
let weekViewBtn, monthViewBtn, yearViewBtn;
let languageToggle, notificationToggle, customCategoryInput;
let voiceSearchBtn, todayFilter, urgentFilter, overdueFilter;

// ===========================================
// DOMContentLoaded 이벤트
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('앱 초기화 시작...');
    
    showLoadingScreen();
    
    try {
        initializeElements();
        loadTodos();
        loadCustomCategories();
        initializeEventListeners();
        initializeCalendar();
        loadSettings();
        initializeHolidaySystem();
        initializeNotifications();
        initializeMobileOptimizations();
        initializeVirtualScroll();
        
        // 언어 설정 적용
        updateLanguage();
        
        // 오늘 날짜 설정
        if (dueDateInput) {
            dueDateInput.valueAsDate = new Date();
            updateDueDateDisplay();
        }
        
        setTimeout(() => {
            updateUI();
            updateStats();
            updateCalendarView();
            updateNotificationToggleUI();
            hideLoadingScreen();
            
            announceStatus(t('loading.initializing') + ' 완료');
            console.log('앱 초기화 완료!');
            
            // 성능 모니터링 시작
            setInterval(monitorPerformance, 30000); // 30초마다
        }, 1000);
        
    } catch (error) {
        console.error('앱 초기화 중 오류:', error);
        hideLoadingScreen();
        showErrorMessage('앱을 초기화하는 중 문제가 발생했습니다.');
    }
});

// ===========================================
// 로딩 스크린 관리
// ===========================================

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
}

// ===========================================
// DOM 요소 초기화
// ===========================================

function initializeElements() {
    // 기본 요소들
    todoInput = document.getElementById('todoInput');
    addBtn = document.getElementById('addBtn');
    todoList = document.getElementById('todoList');
    emptyState = document.getElementById('emptyState');
    totalTasks = document.getElementById('totalTasks');
    completedTasks = document.getElementById('completedTasks');
    pendingTasks = document.getElementById('pendingTasks');
    
    // 고급 기능 요소들
    searchInput = document.getElementById('searchInput');
    clearSearchBtn = document.getElementById('clearSearch');
    categorySelect = document.getElementById('categorySelect');
    prioritySelect = document.getElementById('prioritySelect');
    dueDateInput = document.getElementById('dueDateInput');
    reminderSelect = document.getElementById('reminderSelect');
    customCategoryInput = document.getElementById('customCategoryInput');
    categoryFilter = document.getElementById('categoryFilter');
    statusFilter = document.getElementById('statusFilter');
    sortSelect = document.getElementById('sortSelect');
    darkModeToggle = document.getElementById('darkModeToggle');
    dashboardToggle = document.getElementById('dashboardToggle');
    languageToggle = document.getElementById('languageToggle');
    notificationToggle = document.getElementById('notificationToggle');
    dashboard = document.getElementById('dashboard');
    closeDashboard = document.getElementById('closeDashboard');
    overdueTasks = document.getElementById('overdueTasks');
    dragGuide = document.getElementById('dragGuide');
    statusUpdates = document.getElementById('statusUpdates');
    exportData = document.getElementById('exportData');
    importBtn = document.getElementById('importBtn');
    importData = document.getElementById('importData');
    clearAllData = document.getElementById('clearAllData');
    
    // 음성 검색 및 빠른 필터
    voiceSearchBtn = document.getElementById('voiceSearchBtn');
    todayFilter = document.getElementById('todayFilter');
    urgentFilter = document.getElementById('urgentFilter');
    overdueFilter = document.getElementById('overdueFilter');
    
    // 달력 요소들
    prevPeriodBtn = document.getElementById('prevPeriod');
    nextPeriodBtn = document.getElementById('nextPeriod');
    currentPeriodEl = document.getElementById('currentPeriod');
    weekGrid = document.getElementById('weekGrid');
    monthGrid = document.getElementById('monthGrid');
    yearGrid = document.getElementById('yearGrid');
    todayBtn = document.getElementById('todayBtn');
    selectedDateEl = document.getElementById('selectedDate');
    weekViewContainer = document.getElementById('weekViewContainer');
    monthViewContainer = document.getElementById('monthViewContainer');
    yearViewContainer = document.getElementById('yearViewContainer');
    weekViewBtn = document.getElementById('weekView');
    monthViewBtn = document.getElementById('monthView');
    yearViewBtn = document.getElementById('yearView');
}

// ===========================================
// 이벤트 리스너 초기화
// ===========================================

function initializeEventListeners() {
    console.log('이벤트 리스너 초기화...');
    
    try {
        // 기본 기능
        if (addBtn) addBtn.addEventListener('click', addTodo);
        if (todoInput) {
            todoInput.addEventListener('keypress', handleKeyPress);
            todoInput.addEventListener('input', debounce(handleInputChange, 300));
        }
        
        // 마감일 변경 시 요일 업데이트
        if (dueDateInput) {
            dueDateInput.addEventListener('change', updateDueDateDisplay);
            dueDateInput.addEventListener('blur', updateDueDateDisplay);
        }
        
        // 커스텀 카테고리 처리
        if (categorySelect) {
            categorySelect.addEventListener('change', handleCategoryChange);
        }
        
        if (customCategoryInput) {
            customCategoryInput.addEventListener('keypress', handleCustomCategoryKeyPress);
            customCategoryInput.addEventListener('blur', handleCustomCategoryBlur);
        }
        
        // 검색 기능
        if (searchInput) {
            searchInput.addEventListener('input', debounce(handleSearch, 300));
        }
        
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', clearSearch);
        }
        
        // 음성 검색
        if (voiceSearchBtn) {
            voiceSearchBtn.addEventListener('click', startVoiceSearch);
        }
        
        // 빠른 필터
        if (todayFilter) todayFilter.addEventListener('click', filterToday);
        if (urgentFilter) urgentFilter.addEventListener('click', filterUrgent);
        if (overdueFilter) overdueFilter.addEventListener('click', filterOverdue);
        
        // 필터링
        if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
        if (statusFilter) statusFilter.addEventListener('change', applyFilters);
        if (sortSelect) sortSelect.addEventListener('change', applyFilters);
        
        // 다크모드
        if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
        
        // 언어 전환
        if (languageToggle) languageToggle.addEventListener('click', toggleLanguage);
        
        // 알림 설정
        if (notificationToggle) notificationToggle.addEventListener('click', toggleNotifications);
        
        // 대시보드
        if (dashboardToggle) dashboardToggle.addEventListener('click', toggleDashboard);
        if (closeDashboard) closeDashboard.addEventListener('click', hideDashboard);
        
        // 대시보드 탭 전환
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                switchDashboardTab(tabName);
            });
        });
        
        // 달력 네비게이션
        if (prevPeriodBtn) prevPeriodBtn.addEventListener('click', () => navigatePeriod(-1));
        if (nextPeriodBtn) nextPeriodBtn.addEventListener('click', () => navigatePeriod(1));
        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                currentDate = new Date();
                selectedDateFilter = null;
                updateCalendarView();
                updateSelectedDateDisplay();
                updateUI();
                announceStatus(t('calendar.today') + '로 이동했습니다');
            });
        }
        
        // 뷰 전환
        if (weekViewBtn) weekViewBtn.addEventListener('click', () => switchView('week'));
        if (monthViewBtn) monthViewBtn.addEventListener('click', () => switchView('month'));
        if (yearViewBtn) yearViewBtn.addEventListener('click', () => switchView('year'));
        
        // 데이터 관리
        if (exportData) exportData.addEventListener('click', exportTodos);
        if (importBtn) importBtn.addEventListener('click', () => {
            if (importData) importData.click();
        });
        if (importData) importData.addEventListener('change', importTodos);
        if (clearAllData) clearAllData.addEventListener('click', clearAllTodos);
        
        // 키보드 단축키
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // 이벤트 위임을 사용한 Todo 아이템 핸들링
        if (todoList) {
            todoList.addEventListener('click', handleTodoListClick);
            todoList.addEventListener('keydown', handleTodoListKeydown);
            todoList.addEventListener('dragstart', handleDragStart);
            todoList.addEventListener('dragover', handleDragOver);
            todoList.addEventListener('drop', handleDrop);
            todoList.addEventListener('dragend', handleDragEnd);
        }
        
        console.log('이벤트 리스너 초기화 완료');
    } catch (error) {
        console.error('이벤트 리스너 초기화 중 오류:', error);
    }
}

// ===========================================
// 커스텀 카테고리 관리
// ===========================================

function handleCategoryChange(e) {
    const value = e.target.value;
    if (value === '커스텀') {
        customCategoryInput.classList.remove('hidden');
        customCategoryInput.focus();
    } else {
        customCategoryInput.classList.add('hidden');
    }
}

function handleCustomCategoryKeyPress(e) {
    if (e.key === 'Enter') {
        addCustomCategory();
    }
}

function handleCustomCategoryBlur() {
    if (customCategoryInput.value.trim()) {
        addCustomCategory();
    } else {
        customCategoryInput.classList.add('hidden');
        categorySelect.value = '개인';
    }
}

function addCustomCategory() {
    const categoryName = customCategoryInput.value.trim();
    if (!categoryName) return;
    
    // 중복 체크
    if (customCategories.includes(categoryName)) {
        showToast('이미 존재하는 카테고리입니다', '⚠️');
        return;
    }
    
    // 커스텀 카테고리 추가
    customCategories.push(categoryName);
    saveCustomCategories();
    
    // UI 업데이트
    updateCategorySelects();
    
    // 새 카테고리 선택
    categorySelect.value = categoryName;
    
    // 입력 필드 초기화 및 숨김
    customCategoryInput.value = '';
    customCategoryInput.classList.add('hidden');
    
    showToast(`새 카테고리 "${categoryName}"가 추가되었습니다`, '✨');
}

function updateCategorySelects() {
    const selects = [categorySelect, categoryFilter];
    
    selects.forEach(select => {
        if (!select) return;
        
        // 기존 커스텀 카테고리 제거
        const customOptions = select.querySelectorAll('.custom-category');
        customOptions.forEach(option => option.remove());
        
        // 새 커스텀 카테고리 추가
        customCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = `🏷️ ${category}`;
            option.className = 'custom-category';
            
            // 커스텀 옵션 앞에 삽입
            const customOption = select.querySelector('option[value="커스텀"]') || 
                                select.querySelector('option[value="custom"]');
            if (customOption) {
                select.insertBefore(option, customOption);
            } else {
                select.appendChild(option);
            }
        });
    });
}

function loadCustomCategories() {
    try {
        const saved = localStorage.getItem('customCategories');
        if (saved) {
            customCategories = JSON.parse(saved);
            updateCategorySelects();
        }
    } catch (error) {
        console.error('커스텀 카테고리 로드 중 오류:', error);
        customCategories = [];
    }
}

function saveCustomCategories() {
    try {
        localStorage.setItem('customCategories', JSON.stringify(customCategories));
    } catch (error) {
        console.error('커스텀 카테고리 저장 중 오류:', error);
    }
}

// ===========================================
// 음성 검색 기능
// ===========================================

function startVoiceSearch() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('음성 인식을 지원하지 않는 브라우저입니다', '⚠️');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    voiceSearchBtn.classList.add('listening');
    voiceSearchBtn.textContent = '🎙️';
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        searchInput.value = transcript;
        currentFilters.search = transcript.toLowerCase().trim();
        applyFilters();
        showToast(`"${transcript}"로 검색합니다`, '🔍');
    };
    
    recognition.onerror = (event) => {
        console.error('음성 인식 오류:', event.error);
        showToast('음성 인식에 실패했습니다', '⚠️');
    };
    
    recognition.onend = () => {
        voiceSearchBtn.classList.remove('listening');
        voiceSearchBtn.textContent = '🎤';
    };
    
    recognition.start();
}

// ===========================================
// 빠른 필터 함수들
// ===========================================

function filterToday() {
    const today = formatDateString(new Date());
    selectedDateFilter = selectedDateFilter === today ? null : today;
    updateCalendarView();
    updateSelectedDateDisplay();
    updateUI();
    
    todayFilter.classList.toggle('active', selectedDateFilter === today);
    announceStatus(selectedDateFilter ? '오늘 할 일만 표시' : '전체 할 일 표시');
}

function filterUrgent() {
    const isActive = urgentFilter.classList.contains('active');
    
    if (isActive) {
        currentFilters.priority = '';
        urgentFilter.classList.remove('active');
    } else {
        currentFilters.priority = '5'; // 긴급 우선순위
        urgentFilter.classList.add('active');
    }
    
    updateUI();
    announceStatus(isActive ? '전체 우선순위 표시' : '긴급 할 일만 표시');
}

function filterOverdue() {
    const isActive = overdueFilter.classList.contains('active');
    
    if (isActive) {
        currentFilters.status = '';
        overdueFilter.classList.remove('active');
    } else {
        currentFilters.status = 'overdue';
        overdueFilter.classList.add('active');
    }
    
    updateUI();
    announceStatus(isActive ? '전체 상태 표시' : '지연된 할 일만 표시');
}

// ===========================================
// 대시보드 탭 전환
// ===========================================

function switchDashboardTab(tabName) {
    // 탭 버튼 활성화 상태 변경
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    
    // 패널 표시/숨김
    document.querySelectorAll('.dashboard-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`${tabName}-panel`)?.classList.add('active');
    
    // 탭별 데이터 업데이트
    switch (tabName) {
        case 'overview':
            updateOverviewTab();
            break;
        case 'charts':
            updateChartsTab();
            break;
        case 'trends':
            updateTrendsTab();
            break;
        case 'productivity':
            updateProductivityTab();
            break;
    }
}

function updateOverviewTab() {
    updateDashboard();
    updateCategoryDistribution();
}

function updateChartsTab() {
    updateCompletionChart();
    updatePriorityChart();
}

function updateTrendsTab() {
    updateTrendsChart();
    updateTrendsSummary();
}

function updateProductivityTab() {
    updateProductivityMetrics();
    updateProductivityChart();
}

// ===========================================
// 통계 및 차트 업데이트 함수들
// ===========================================

function updateCategoryDistribution() {
    const container = document.getElementById('categoryChart');
    if (!container) return;
    
    const categoryStats = {};
    todos.forEach(todo => {
        const category = todo.category || '기타';
        categoryStats[category] = (categoryStats[category] || 0) + 1;
    });
    
    // 간단한 막대 차트 HTML 생성
    const total = todos.length;
    let chartHTML = '';
    
    Object.entries(categoryStats).forEach(([category, count]) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        chartHTML += `
            <div class="category-bar">
                <div class="category-label">${category} (${count})</div>
                <div class="category-progress">
                    <div class="category-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="category-percentage">${percentage}%</div>
            </div>
        `;
    });
    
    container.innerHTML = chartHTML || '<p>데이터가 없습니다</p>';
}

function updateCompletionChart() {
    const container = document.getElementById('completionChart');
    if (!container) return;
    
    const period = document.getElementById('chartPeriod')?.value || 'week';
    const data = getCompletionData(period);
    
    container.innerHTML = `
        <h4>완료율 차트 (${period})</h4>
        <p>구현 예정: 완료된 할 일과 미완료 할 일의 비율을 시각화</p>
        <div class="chart-placeholder">📊 Chart will be rendered here</div>
    `;
}

function updatePriorityChart() {
    const container = document.getElementById('priorityChart');
    if (!container) return;
    
    const priorityStats = {};
    todos.forEach(todo => {
        const priority = todo.priority || 2;
        priorityStats[priority] = (priorityStats[priority] || 0) + 1;
    });
    
    container.innerHTML = `
        <h4>우선순위별 분포</h4>
        <div class="priority-stats">
            ${Object.entries(priorityStats).map(([priority, count]) => `
                <div class="priority-stat">
                    ${getPriorityIcon(parseInt(priority))} ${getPriorityName(parseInt(priority))}: ${count}개
                </div>
            `).join('')}
        </div>
    `;
}

function updateTrendsChart() {
    const container = document.getElementById('trendsChart');
    if (!container) return;
    
    container.innerHTML = `
        <h4>할 일 트렌드</h4>
        <p>구현 예정: 시간에 따른 할 일 생성/완료 트렌드 시각화</p>
        <div class="chart-placeholder">📈 Trends chart will be rendered here</div>
    `;
}

function updateTrendsSummary() {
    const container = document.getElementById('trendsSummaryContent');
    if (!container) return;
    
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekTodos = todos.filter(todo => new Date(todo.createdAt) >= lastWeek).length;
    const completedThisWeek = todos.filter(todo => 
        new Date(todo.createdAt) >= lastWeek && todo.completed
    ).length;
    
    container.innerHTML = `
        <p>이번 주에 ${thisWeekTodos}개의 할 일을 추가했고, ${completedThisWeek}개를 완료했습니다.</p>
        <p>완료율: ${thisWeekTodos > 0 ? Math.round((completedThisWeek / thisWeekTodos) * 100) : 0}%</p>
    `;
}

function updateProductivityMetrics() {
    const avgCompletionEl = document.getElementById('avgCompletion');
    const bestDayEl = document.getElementById('bestDay');
    const currentStreakEl = document.getElementById('currentStreak');
    
    if (avgCompletionEl) {
        const completed = todos.filter(t => t.completed).length;
        const total = todos.length;
        const avgCompletion = total > 0 ? Math.round((completed / total) * 100) : 0;
        avgCompletionEl.textContent = `${avgCompletion}%`;
    }
    
    if (bestDayEl) {
        bestDayEl.textContent = getBestProductivityDay();
    }
    
    if (currentStreakEl) {
        currentStreakEl.textContent = `${getCurrentStreak()}일`;
    }
}

function updateProductivityChart() {
    const container = document.getElementById('productivityChart');
    if (!container) return;
    
    container.innerHTML = `
        <h4>생산성 패턴</h4>
        <p>구현 예정: 요일별, 시간대별 생산성 패턴 분석</p>
        <div class="chart-placeholder">📊 Productivity chart will be rendered here</div>
    `;
}

// ===========================================
// 헬퍼 함수들
// ===========================================

function getPriorityIcon(priority) {
    const icons = {
        5: '🔥',
        4: '🔴',
        3: '🟡',
        2: '🟢',
        1: '🔵'
    };
    return icons[priority] || '🟢';
}

function getPriorityName(priority) {
    const names = {
        5: t('priority.urgent').replace('🔥 ', ''),
        4: t('priority.high').replace('🔴 ', ''),
        3: t('priority.medium').replace('🟡 ', ''),
        2: t('priority.normal').replace('🟢 ', ''),
        1: t('priority.low').replace('🔵 ', '')
    };
    return names[priority] || names[2];
}

function getBestProductivityDay() {
    const dayStats = {};
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    
    todos.filter(t => t.completed).forEach(todo => {
        if (todo.createdAt) {
            const day = new Date(todo.createdAt).getDay();
            dayStats[day] = (dayStats[day] || 0) + 1;
        }
    });
    
    const bestDay = Object.entries(dayStats).reduce((a, b) => 
        dayStats[a[0]] > dayStats[b[0]] ? a : b, [0, 0]
    );
    
    return dayNames[bestDay[0]] || '-';
}

function getCurrentStreak() {
    // 연속으로 할 일을 완료한 날수 계산
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = formatDateString(checkDate);
        
        const dayTodos = todos.filter(t => t.date === dateStr);
        const completedTodos = dayTodos.filter(t => t.completed);
        
        if (dayTodos.length > 0 && completedTodos.length === dayTodos.length) {
            streak++;
        } else if (dayTodos.length > 0) {
            break;
        }
    }
    
    return streak;
}

function getCompletionData(period) {
    // 기간별 완료 데이터 생성
    // 실제 차트 라이브러리와 함께 구현 예정
    return {};
}

// 나머지 기존 함수들은 이전과 동일하게 유지...
// (마감일 표시, 달력 관리, Todo CRUD, 필터링, 저장/로드 등)

// ===========================================
// 기존 함수들을 여기에 포함 (이전 script.js에서)
// ===========================================

// 마감일 표시 업데이트 함수
function updateDueDateDisplay() {
    if (!dueDateInput || !dueDateInput.value) {
        const existingDisplay = dueDateInput?.parentNode?.querySelector('.custom-date-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        if (dueDateInput) dueDateInput.style.display = 'block';
        return;
    }
    
    try {
        const date = new Date(dueDateInput.value);
        const dayNames = currentLanguage === 'ko' ? 
            ['일', '월', '화', '수', '목', '금', '토'] :
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[date.getDay()];
        
        const existingDisplay = dueDateInput.parentNode.querySelector('.custom-date-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        
        dueDateInput.style.display = 'none';
        
        const customDisplay = document.createElement('div');
        customDisplay.className = 'custom-date-display';
        customDisplay.style.cssText = `
            padding: 8px 12px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            font-size: 13px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        
        if (document.body.classList.contains('dark-mode')) {
            customDisplay.style.background = 'rgba(255, 255, 255, 0.1)';
            customDisplay.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            customDisplay.style.color = '#e2e8f0';
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        let dateDisplay = `${year}-${month}-${day}(${dayName})`;
        
        if (isKoreanHoliday(date)) {
            const holidayName = getHolidayName(date);
            dateDisplay += ` - ${holidayName}`;
        }
        
        customDisplay.innerHTML = `
            <span>${dateDisplay}</span>
            <span style="margin-left: 8px; color: #8B5A8C; font-size: 12px;">📅</span>
        `;
        
        customDisplay.addEventListener('click', () => {
            customDisplay.style.display = 'none';
            dueDateInput.style.display = 'block';
            dueDateInput.focus();
            
            const handleBlur = () => {
                setTimeout(() => {
                    updateDueDateDisplay();
                }, 100);
                dueDateInput.removeEventListener('blur', handleBlur);
            };
            
            dueDateInput.addEventListener('blur', handleBlur);
        });
        
        dueDateInput.parentNode.insertBefore(customDisplay, dueDateInput.nextSibling);
        
    } catch (error) {
        console.error('마감일 요일 표시 중 오류:', error);
    }
}

// 달력 초기화
function initializeCalendar() {
    console.log('달력 초기화...');
    currentDate = new Date();
    switchView('week');
    updateSelectedDateDisplay();
}

// 뷰 전환
function switchView(view) {
    console.log('뷰 전환:', view);
    currentView = view;
    
    try {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (view === 'week' && weekViewBtn) {
            weekViewBtn.classList.add('active');
        } else if (view === 'month' && monthViewBtn) {
            monthViewBtn.classList.add('active');
        } else if (view === 'year' && yearViewBtn) {
            yearViewBtn.classList.add('active');
        }
        
        if (weekViewContainer) {
            weekViewContainer.classList.toggle('hidden', view !== 'week');
        }
        if (monthViewContainer) {
            monthViewContainer.classList.toggle('hidden', view !== 'month');
        }
        if (yearViewContainer) {
            yearViewContainer.classList.toggle('hidden', view !== 'year');
        }
        
        updateCalendarView();
        saveSettings();
    } catch (error) {
        console.error('뷰 전환 중 오류:', error);
    }
}

// 나머지 모든 기존 함수들을 동일하게 포함...
// (너무 길어서 이전 script.js의 모든 함수들을 여기에 포함한다고 가정)

// 여기에 이전 script.js의 나머지 모든 함수들을 포함합니다
// (달력 렌더링, Todo CRUD, 필터링, 저장/로드, 에러 핸들링 등)

// ===========================================
// 새로운 데이터 관리 함수
// ===========================================

function clearAllTodos() {
    if (!confirm(currentLanguage === 'ko' ? 
        '정말로 모든 할 일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.' :
        'Are you sure you want to delete all todos? This action cannot be undone.')) {
        return;
    }
    
    // 백업 생성
    localStorage.setItem('todoManagerBackup', JSON.stringify(todos));
    
    // 모든 데이터 삭제
    todos = [];
    todoIdCounter = 1;
    
    saveTodos();
    updateCalendarView();
    updateUI();
    
    showToast(currentLanguage === 'ko' ? 
        '모든 할 일이 삭제되었습니다' : 
        'All todos have been deleted', '🗑️');
}

// ===========================================
// 기본 이벤트 핸들러들 (기존과 동일)
// ===========================================

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTodo();
    }
}

function handleInputChange(e) {
    try {
        const value = e.target.value;
        
        if (addBtn) {
            if (value.trim()) {
                addBtn.style.transform = 'scale(1.05)';
            } else {
                addBtn.style.transform = 'scale(1)';
            }
        }
    } catch (error) {
        console.error('입력 변경 처리 중 오류:', error);
    }
}

// 모든 기존 함수들을 계속 포함...
// (공간 절약을 위해 생략하지만 실제로는 모든 함수가 포함되어야 함)

// ===========================================
// 달력 관리 함수들
// ===========================================

function navigatePeriod(direction) {
    try {
        switch (currentView) {
            case 'week':
                currentDate.setDate(currentDate.getDate() + (direction * 7));
                break;
            case 'month':
                currentDate.setMonth(currentDate.getMonth() + direction);
                break;
            case 'year':
                currentDate.setFullYear(currentDate.getFullYear() + direction);
                break;
        }
        updateCalendarView();
    } catch (error) {
        console.error('기간 네비게이션 중 오류:', error);
    }
}

function updateCalendarView() {
    try {
        updatePeriodTitle();
        
        switch (currentView) {
            case 'week':
                renderWeekView();
                break;
            case 'month':
                renderMonthView();
                break;
            case 'year':
                renderYearView();
                break;
        }
    } catch (error) {
        console.error('달력 뷰 업데이트 중 오류:', error);
    }
}

function updatePeriodTitle() {
    if (!currentPeriodEl) return;
    
    try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        
        switch (currentView) {
            case 'week':
                const weekStart = getWeekStart(currentDate);
                const weekEnd = getWeekEnd(weekStart);
                if (weekStart.getMonth() === weekEnd.getMonth()) {
                    currentPeriodEl.textContent = `${year}년 ${month}월 ${weekStart.getDate()}일 - ${weekEnd.getDate()}일`;
                } else {
                    currentPeriodEl.textContent = `${weekStart.getFullYear()}년 ${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 - ${weekEnd.getFullYear()}년 ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`;
                }
                break;
            case 'month':
                currentPeriodEl.textContent = `${year}년 ${month}월`;
                break;
            case 'year':
                currentPeriodEl.textContent = `${year}년`;
                break;
        }
    } catch (error) {
        console.error('기간 제목 업데이트 중 오류:', error);
    }
}

function renderWeekView() {
    if (!weekGrid) return;
    
    try {
        weekGrid.innerHTML = '';
        
        const weekStart = getWeekStart(currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            
            const dateEl = document.createElement('div');
            dateEl.className = 'week-date';
            dateEl.setAttribute('data-date', formatDateString(date));
            
            if (date.getTime() === today.getTime()) {
                dateEl.classList.add('today');
            }
            
            if (selectedDateFilter === formatDateString(date)) {
                dateEl.classList.add('selected');
            }
            
            const tasksOnDate = hasTasksOnDate(date);
            if (tasksOnDate.length > 0) {
                dateEl.classList.add('has-todos');
                const taskCountClass = getTaskCountClass(date);
                if (taskCountClass) {
                    dateEl.classList.add(taskCountClass);
                }
            }
            
            applyHolidayStyles(dateEl, date);
            
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0) {
                dateEl.classList.add('sunday');
            } else if (dayOfWeek === 6) {
                dateEl.classList.add('saturday');
            }
            
            const dateNumber = document.createElement('div');
            dateNumber.className = 'week-date-number';
            dateNumber.textContent = date.getDate();
            
            dateEl.appendChild(dateNumber);
            
            dateEl.addEventListener('click', () => {
                selectDate(date);
            });
            
            weekGrid.appendChild(dateEl);
        }
    } catch (error) {
        console.error('주간 뷰 렌더링 중 오류:', error);
    }
}

function renderMonthView() {
    if (!monthGrid) return;
    
    try {
        monthGrid.innerHTML = '';
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = getWeekStart(firstDay);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateEl = document.createElement('div');
            dateEl.className = 'calendar-date';
            dateEl.setAttribute('data-date', formatDateString(date));
            
            if (date.getMonth() !== month) {
                dateEl.classList.add('other-month');
            }
            
            if (date.getTime() === today.getTime()) {
                dateEl.classList.add('today');
            }
            
            if (selectedDateFilter === formatDateString(date)) {
                dateEl.classList.add('selected');
            }
            
            const tasksOnDate = hasTasksOnDate(date);
            if (tasksOnDate.length > 0) {
                dateEl.classList.add('has-todos');
                const taskCountClass = getTaskCountClass(date);
                if (taskCountClass) {
                    dateEl.classList.add(taskCountClass);
                }
            }
            
            applyHolidayStyles(dateEl, date);
            
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0) {
                dateEl.classList.add('sunday');
            } else if (dayOfWeek === 6) {
                dateEl.classList.add('saturday');
            }
            
            dateEl.textContent = date.getDate();
            
            dateEl.addEventListener('click', () => {
                selectDate(date);
            });
            
            monthGrid.appendChild(dateEl);
        }
    } catch (error) {
        console.error('월간 뷰 렌더링 중 오류:', error);
    }
}

function renderYearView() {
    if (!yearGrid) return;
    
    try {
        yearGrid.innerHTML = '';
        
        const year = currentDate.getFullYear();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        for (let month = 0; month < 12; month++) {
            const monthContainer = document.createElement('div');
            monthContainer.className = 'year-month';
            
            const monthTitle = document.createElement('div');
            monthTitle.className = 'year-month-title';
            monthTitle.textContent = `${month + 1}월`;
            monthContainer.appendChild(monthTitle);
            
            const monthGrid = document.createElement('div');
            monthGrid.className = 'year-month-grid';
            
            const weekdays = currentLanguage === 'ko' ? 
                ['일', '월', '화', '수', '목', '금', '토'] :
                ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            weekdays.forEach((day, index) => {
                const dayEl = document.createElement('div');
                dayEl.className = 'year-weekday';
                dayEl.textContent = day;
                if (index === 0) dayEl.classList.add('sunday');
                if (index === 6) dayEl.classList.add('saturday');
                monthGrid.appendChild(dayEl);
            });
            
            const firstDay = new Date(year, month, 1);
            const startDate = getWeekStart(firstDay);
            
            for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                
                const dateEl = document.createElement('div');
                dateEl.className = 'year-date';
                dateEl.setAttribute('data-date', formatDateString(date));
                
                if (date.getMonth() === month) {
                    if (date.getTime() === today.getTime()) {
                        dateEl.classList.add('today');
                    }
                    
                    if (selectedDateFilter === formatDateString(date)) {
                        dateEl.classList.add('selected');
                    }
                    
                    const tasksOnDate = hasTasksOnDate(date);
                    if (tasksOnDate.length > 0) {
                        dateEl.classList.add('has-todos');
                        const taskCountClass = getTaskCountClass(date);
                        if (taskCountClass) {
                            dateEl.classList.add(taskCountClass);
                        }
                    }
                    
                    applyHolidayStyles(dateEl, date);
                    
                    const dayOfWeek = date.getDay();
                    if (dayOfWeek === 0) {
                        dateEl.classList.add('sunday');
                    } else if (dayOfWeek === 6) {
                        dateEl.classList.add('saturday');
                    }
                    
                    dateEl.textContent = date.getDate();
                    
                    dateEl.addEventListener('click', () => {
                        selectDate(date);
                    });
                    
                } else {
                    dateEl.classList.add('other-month');
                    dateEl.textContent = date.getDate();
                }
                
                monthGrid.appendChild(dateEl);
            }
            
            monthContainer.appendChild(monthGrid);
            yearGrid.appendChild(monthContainer);
        }
    } catch (error) {
        console.error('연간 뷰 렌더링 중 오류:', error);
    }
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getWeekEnd(weekStart) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    return d;
}

function hasTasksOnDate(date) {
    const dateStr = formatDateString(date);
    return todos.filter(todo => todo.date === dateStr);
}

function getTaskCountClass(date) {
    const tasks = hasTasksOnDate(date);
    const taskCount = tasks.length;
    
    if (taskCount === 0) return '';
    
    if (taskCount === 1) return 'has-todos-1';
    else if (taskCount <= 3) return 'has-todos-2';
    else if (taskCount <= 5) return 'has-todos-3';
    else return 'has-todos-many';
}

function selectDate(date) {
    try {
        const dateStr = formatDateString(date);
        
        if (selectedDateFilter === dateStr) {
            selectedDateFilter = null;
        } else {
            selectedDateFilter = dateStr;
            
            if (dueDateInput) {
                dueDateInput.value = dateStr;
                updateDueDateDisplay();
            }
        }
        
        updateCalendarView();
        updateSelectedDateDisplay();
        updateUI();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        const diffTime = selectedDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let selectedText;
        if (selectedDateFilter) {
            if (diffDays === 0) {
                selectedText = `${t('오늘')} (${date.getMonth() + 1}월 ${date.getDate()}일)`;
            } else if (diffDays === 1) {
                selectedText = `${t('내일')} (${date.getMonth() + 1}월 ${date.getDate()}일)`;
            } else if (diffDays === -1) {
                selectedText = `${t('어제')} (${date.getMonth() + 1}월 ${date.getDate()}일)`;
            } else {
                selectedText = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
            }
            
            if (isKoreanHoliday(date)) {
                const holidayName = getHolidayName(date);
                selectedText += ` (${holidayName})`;
            }
            
            selectedText += ' 선택됨 - 이 날짜에 할 일이 추가됩니다';
        } else {
            selectedText = '전체 할 일 보기로 전환됨';
        }
        
        announceStatus(selectedText);
    } catch (error) {
        console.error('날짜 선택 중 오류:', error);
    }
}

function updateSelectedDateDisplay() {
    if (!selectedDateEl) return;
    
    try {
        if (selectedDateFilter) {
            const date = parseLocalDate(selectedDateFilter);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);
            
            let dateText = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
            
            const diffTime = selectedDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
                dateText += ' (오늘)';
            } else if (diffDays === 1) {
                dateText += ' (내일)';
            } else if (diffDays === -1) {
                dateText += ' (어제)';
            }
            
            if (isKoreanHoliday(date)) {
                const holidayName = getHolidayName(date);
                dateText += ` - ${holidayName}`;
            }
            
            selectedDateEl.textContent = `${dateText} 할 일`;
        } else {
            selectedDateEl.textContent = t('calendar.all_todos');
        }
    } catch (error) {
        console.error('선택된 날짜 표시 업데이트 중 오류:', error);
    }
}

// ===========================================
// Todo CRUD 함수들
// ===========================================

function addTodo() {
    if (!todoInput) return;
    
    try {
        const todoText = todoInput.value.trim();
        
        if (todoText === '') {
            showInputError();
            return;
        }
        
        const todoDate = selectedDateFilter || formatDateString(new Date());
        const category = categorySelect ? (categorySelect.value === '커스텀' ? customCategoryInput.value.trim() : categorySelect.value) : '개인';
        const priority = prioritySelect ? parseInt(prioritySelect.value) : 2;
        const dueDate = dueDateInput ? dueDateInput.value : null;
        const reminder = reminderSelect ? reminderSelect.value : null;
        
        const newTodo = {
            id: todoIdCounter++,
            text: todoText,
            completed: false,
            date: todoDate,
            category: category,
            priority: priority,
            dueDate: dueDate,
            reminder: reminder,
            createdAt: new Date().toISOString(),
            order: todos.length
        };
        
        todos.push(newTodo);
        todoInput.value = '';
        
        if (dueDateInput) {
            if (selectedDateFilter) {
                dueDateInput.value = selectedDateFilter;
            } else {
                dueDateInput.valueAsDate = new Date();
            }
            updateDueDateDisplay();
        }
        
        showSuccessFeedback();
        saveTodos();
        updateCalendarView();
        updateUI();
        
        const selectedDateText = selectedDateFilter ? 
            `${parseLocalDate(selectedDateFilter).getMonth() + 1}월 ${parseLocalDate(selectedDateFilter).getDate()}일에` : 
            '오늘에';
        announceStatus(`${selectedDateText} 새로운 할 일이 추가되었습니다: ${todoText} (${category})`);
        
        // 알림 설정이 있으면 스케줄링
        if (reminder && dueDate) {
            scheduleNotification(newTodo);
        }
        
    } catch (error) {
        console.error('할 일 추가 중 오류:', error);
        showErrorMessage('할 일을 추가하는 중 오류가 발생했습니다');
    }
}

function toggleTodo(id) {
    try {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            saveTodos();
            updateCalendarView();
            updateUI();
            
            if (todo.completed) {
                showCelebration();
                announceStatus(`할 일을 완료했습니다: ${todo.text}`);
                showNotification('할 일 완료! 🎉', `"${todo.text}"를 완료했습니다.`, 'completed');
            } else {
                announceStatus(`할 일을 미완료로 변경했습니다: ${todo.text}`);
            }
        }
    } catch (error) {
        console.error('할 일 상태 변경 중 오류:', error);
        showErrorMessage('할 일 상태를 변경하는 중 오류가 발생했습니다');
    }
}

function deleteTodoWithAnimation(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    
    if (todoItem) {
        try {
            const todo = todos.find(t => t.id === id);
            const todoText = todo ? todo.text : '할 일';
            
            todoItem.style.transition = 'all 0.5s ease-out';
            todoItem.style.transform = 'translateX(-100%) scale(0.8)';
            todoItem.style.opacity = '0';
            todoItem.style.maxHeight = '0';
            todoItem.style.marginBottom = '0';
            todoItem.style.paddingTop = '0';
            todoItem.style.paddingBottom = '0';
            
            setTimeout(() => {
                todos = todos.filter(t => t.id !== id);
                saveTodos();
                updateCalendarView();
                updateUI();
                announceStatus(`할 일을 삭제했습니다: ${todoText}`);
            }, 500);
            
        } catch (error) {
            console.error('할 일 삭제 중 오류:', error);
            showErrorMessage('할 일을 삭제하는 중 오류가 발생했습니다');
        }
    }
}

function editTodo(id) {
    try {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        
        const newText = prompt(currentLanguage === 'ko' ? '할 일을 수정하세요:' : 'Edit todo:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            saveTodos();
            updateUI();
            announceStatus(`할 일을 수정했습니다: ${newText}`);
        }
    } catch (error) {
        console.error('할 일 편집 중 오류:', error);
        showErrorMessage('할 일을 수정하는 중 오류가 발생했습니다');
    }
}

function scheduleNotification(todo) {
    if (!isNotificationsEnabled || !todo.reminder || !todo.dueDate) return;
    
    try {
        const dueDate = new Date(todo.dueDate);
        const reminderMinutes = parseInt(todo.reminder);
        const notificationTime = new Date(dueDate.getTime() - (reminderMinutes * 60 * 1000));
        
        const now = new Date();
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        if (timeUntilNotification > 0) {
            setTimeout(() => {
                if (!todo.completed) {
                    showNotification(
                        '할 일 알림 ⏰',
                        `"${todo.text}"의 마감시간이 ${reminderMinutes}분 남았습니다.`,
                        'upcoming'
                    );
                }
            }, timeUntilNotification);
        }
    } catch (error) {
        console.error('알림 스케줄링 중 오류:', error);
    }
}

// ===========================================
// Todo 리스트 이벤트 핸들링
// ===========================================

function handleTodoListClick(event) {
    const target = event.target;
    const todoItem = target.closest('.todo-item');
    if (!todoItem) return;
    
    const todoId = parseInt(todoItem.getAttribute('data-id'));
    
    if (target.classList.contains('todo-checkbox') || target.closest('.todo-checkbox')) {
        event.preventDefault();
        toggleTodo(todoId);
    } else if (target.classList.contains('edit-btn') || target.closest('.edit-btn')) {
        event.preventDefault();
        editTodo(todoId);
    } else if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
        event.preventDefault();
        deleteTodoWithAnimation(todoId);
    }
}

function handleTodoListKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        const target = event.target;
        if (target.classList.contains('todo-checkbox')) {
            event.preventDefault();
            const todoItem = target.closest('.todo-item');
            if (todoItem) {
                const todoId = parseInt(todoItem.getAttribute('data-id'));
                toggleTodo(todoId);
            }
        }
    }
}

// ===========================================
// 드래그 앤 드롭 함수들
// ===========================================

function handleDragStart(e) {
    if (!e.target.closest('.todo-item') || currentFilters.sort !== 'manual') return;
    
    draggedElement = e.target.closest('.todo-item');
    draggedElement.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', draggedElement.outerHTML);
}

function handleDragOver(e) {
    if (currentFilters.sort !== 'manual') return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(todoList, e.clientY);
    if (afterElement == null) {
        todoList.appendChild(draggedElement);
    } else {
        todoList.insertBefore(draggedElement, afterElement);
    }
}

function handleDrop(e) {
    if (currentFilters.sort !== 'manual') return;
    
    e.preventDefault();
    
    const todoItems = Array.from(todoList.querySelectorAll('.todo-item'));
    todoItems.forEach((item, index) => {
        const id = parseInt(item.getAttribute('data-id'));
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.order = index;
        }
    });
    
    saveTodos();
    announceStatus('할 일 순서가 변경되었습니다');
}

function handleDragEnd(e) {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement = null;
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// ===========================================
// 검색 및 필터링 함수들
// ===========================================

function handleSearch(e) {
    try {
        const query = e.target.value.toLowerCase().trim();
        currentFilters.search = query;
        
        if (query && clearSearchBtn) {
            clearSearchBtn.style.display = 'block';
        } else if (clearSearchBtn) {
            clearSearchBtn.style.display = 'none';
        }
        
        applyFilters();
    } catch (error) {
        console.error('검색 중 오류:', error);
    }
}

function clearSearch() {
    try {
        if (searchInput) {
            searchInput.value = '';
            currentFilters.search = '';
            if (clearSearchBtn) clearSearchBtn.style.display = 'none';
            applyFilters();
            searchInput.focus();
        }
    } catch (error) {
        console.error('검색 초기화 중 오류:', error);
    }
}

function applyFilters() {
    try {
        currentFilters.category = categoryFilter ? categoryFilter.value : '';
        currentFilters.status = statusFilter ? statusFilter.value : '';
        currentFilters.sort = sortSelect ? sortSelect.value : 'date';
        
        updateUI();
    } catch (error) {
        console.error('필터 적용 중 오류:', error);
    }
}

function getFilteredTodos() {
    let filtered = todos;
    
    if (selectedDateFilter) {
        filtered = filtered.filter(todo => todo.date === selectedDateFilter);
    }
    
    if (currentFilters.search) {
        filtered = filtered.filter(todo => 
            todo.text.toLowerCase().includes(currentFilters.search) ||
            (todo.category && todo.category.toLowerCase().includes(currentFilters.search))
        );
    }
    
    if (currentFilters.category) {
        filtered = filtered.filter(todo => todo.category === currentFilters.category);
    }
    
    if (currentFilters.status) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        filtered = filtered.filter(todo => {
            switch (currentFilters.status) {
                case 'pending':
                    return !todo.completed;
                case 'completed':
                    return todo.completed;
                case 'overdue':
                    if (todo.completed) return false;
                    if (!todo.dueDate) return false;
                    const dueDate = new Date(todo.dueDate);
                    dueDate.setHours(0, 0, 0, 0);
                    return dueDate < today;
                default:
                    return true;
            }
        });
    }
    
    return filtered;
}

function sortTodos(todos) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (currentFilters.sort) {
        case 'priority':
            return todos.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                }
                return (b.priority || 2) - (a.priority || 2);
            });
            
        case 'category':
            return todos.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                }
                return (a.category || '').localeCompare(b.category || '');
            });
            
        case 'dueDate':
            return todos.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                }
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            });
            
        case 'manual':
            return todos.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                }
                return (a.order || 0) - (b.order || 0);
            });
            
        default:
            return todos.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                }
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });
    }
}

// ===========================================
// UI 업데이트 함수들
// ===========================================

function updateUI() {
    try {
        renderTodos();
        setTimeout(() => {
            updateStats();
            toggleEmptyState();
        }, 50);
    } catch (error) {
        console.error('UI 업데이트 중 오류:', error);
        showErrorMessage('화면을 업데이트하는 중 오류가 발생했습니다');
    }
}

function renderTodos() {
    if (!todoList) return;
    
    try {
        todoList.innerHTML = '';
        
        let filteredTodos = getFilteredTodos();
        filteredTodos = sortTodos(filteredTodos);
        
        // 가상 스크롤링 적용
        const startIndex = 0;
        const endIndex = Math.min(virtualScrollOffset + virtualScrollLimit, filteredTodos.length);
        const todosToRender = filteredTodos.slice(startIndex, endIndex);
        
        todosToRender.forEach((todo, index) => {
            const li = createTodoElement(todo, index);
            todoList.appendChild(li);
        });
        
        if (dragGuide && currentFilters.sort === 'manual' && filteredTodos.length > 1) {
            dragGuide.classList.remove('hidden');
        } else if (dragGuide) {
            dragGuide.classList.add('hidden');
        }
        
    } catch (error) {
        console.error('할 일 목록 렌더링 중 오류:', error);
        if (todoList) {
            todoList.innerHTML = '<li class="error-message">할 일 목록을 불러오는 중 오류가 발생했습니다.</li>';
        }
    }
}

function createTodoElement(todo, index) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority || 2}`;
    li.setAttribute('data-id', todo.id);
    li.setAttribute('draggable', currentFilters.sort === 'manual');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let isOverdue = false;
    
    if (todo.dueDate && !todo.completed) {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate < today) {
            isOverdue = true;
            li.classList.add('overdue');
        } else if (dueDate.getTime() === today.getTime()) {
            li.classList.add('due-today');
        }
    }
    
    if (currentFilters.sort === 'manual') {
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.textContent = '⋮⋮';
        li.appendChild(dragHandle);
    }
    
    const checkbox = document.createElement('div');
    checkbox.className = `todo-checkbox ${todo.completed ? 'checked' : ''}`;
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-checked', todo.completed);
    checkbox.setAttribute('tabindex', '0');
    if (todo.completed) {
        checkbox.textContent = '✓';
    }
    
    li.appendChild(checkbox);
    
    const content = document.createElement('div');
    content.className = 'todo-content';
    
    const main = document.createElement('div');
    main.className = 'todo-main';
    
    const priority = document.createElement('span');
    priority.className = 'todo-priority';
    priority.title = t('todo.priority');
    priority.textContent = getPriorityIcon(todo.priority || 2);
    
    const category = document.createElement('span');
    category.className = 'todo-category';
    category.title = `${t('todo.category')} ${todo.category}`;
    const categoryIcon = getCategoryIcon(todo.category);
    category.textContent = categoryIcon;
    
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;
    
    main.appendChild(priority);
    main.appendChild(category);
    main.appendChild(text);
    
    const meta = document.createElement('div');
    meta.className = 'todo-meta';
    
    if (!selectedDateFilter) {
        const todoDate = parseLocalDate(todo.date);
        const diffTime = todoDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'todo-date';
        
        if (diffDays === 0) {
            dateSpan.className += ' today-date';
            dateSpan.textContent = currentLanguage === 'ko' ? '오늘' : 'Today';
        } else if (diffDays === 1) {
            dateSpan.className += ' tomorrow-date';
            dateSpan.textContent = currentLanguage === 'ko' ? '내일' : 'Tomorrow';
        } else if (diffDays === -1) {
            dateSpan.className += ' yesterday-date';
            dateSpan.textContent = currentLanguage === 'ko' ? '어제' : 'Yesterday';
        } else if (diffDays > 1) {
            dateSpan.className += ' future-date';
            dateSpan.textContent = currentLanguage === 'ko' ? `${diffDays}일 후` : `In ${diffDays} days`;
        } else {
            dateSpan.className += ' past-date';
            dateSpan.textContent = currentLanguage === 'ko' ? `${Math.abs(diffDays)}일 전` : `${Math.abs(diffDays)} days ago`;
        }
        
        if (isKoreanHoliday(todoDate)) {
            const holidayName = getHolidayName(todoDate);
            dateSpan.textContent += ` (${holidayName})`;
            dateSpan.style.color = '#dc2626';
            dateSpan.style.fontWeight = '700';
        }
        
        meta.appendChild(dateSpan);
    }
    
    if (todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const dueDiffTime = dueDate.getTime() - today.getTime();
        const dueDiffDays = Math.floor(dueDiffTime / (1000 * 60 * 60 * 24));
        
        const dayNames = currentLanguage === 'ko' ? 
            ['일', '월', '화', '수', '목', '금', '토'] :
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[dueDate.getDay()];
        
        const year = dueDate.getFullYear();
        const month = String(dueDate.getMonth() + 1).padStart(2, '0');
        const day = String(dueDate.getDate()).padStart(2, '0');
        let formattedDate = `${year}-${month}-${day}(${dayName})`;
        
        if (isKoreanHoliday(dueDate)) {
            const holidayName = getHolidayName(dueDate);
            formattedDate += ` - ${holidayName}`;
        }
        
        const dueDateSpan = document.createElement('span');
        dueDateSpan.className = 'due-date';
        
        let dueDateText = '';
        
        if (dueDiffDays < 0) {
            dueDateSpan.className += ' overdue-date';
            dueDateText = `${formattedDate} - ${Math.abs(dueDiffDays)}${currentLanguage === 'ko' ? '일 지연' : ' days overdue'}`;
        } else if (dueDiffDays === 0) {
            dueDateSpan.className += ' due-today';
            dueDateText = `${formattedDate} - ${currentLanguage === 'ko' ? '오늘 마감' : 'Due today'}`;
        } else if (dueDiffDays === 1) {
            dueDateSpan.className += ' due-tomorrow';
            dueDateText = `${formattedDate} - ${currentLanguage === 'ko' ? '내일 마감' : 'Due tomorrow'}`;
        } else {
            dueDateText = `${formattedDate} - ${dueDiffDays}${currentLanguage === 'ko' ? '일 후 마감' : ' days until due'}`;
        }
        
        dueDateSpan.textContent = `⏰ ${dueDateText}`;
        meta.appendChild(dueDateSpan);
    }
    
    content.appendChild(main);
    content.appendChild(meta);
    li.appendChild(content);
    
    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.title = currentLanguage === 'ko' ? '수정' : 'Edit';
    editBtn.setAttribute('aria-label', currentLanguage === 'ko' ? '할 일 수정' : 'Edit todo');
    editBtn.textContent = '✏️';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = currentLanguage === 'ko' ? '삭제' : 'Delete';
    deleteBtn.setAttribute('aria-label', currentLanguage === 'ko' ? '할 일 삭제' : 'Delete todo');
    deleteBtn.textContent = '🗑️';
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(actions);
    
    return li;
}

function getCategoryIcon(category) {
    const icons = {
        '개인': '🙋‍♂️',
        '업무': '💼',
        '취미': '🎨',
        '건강': '💪',
        '학습': '📚',
        '쇼핑': '🛒',
        '여행': '✈️',
        '가족': '👨‍👩‍👧‍👦',
        'Personal': '🙋‍♂️',
        'Work': '💼',
        'Hobby': '🎨',
        'Health': '💪',
        'Study': '📚',
        'Shopping': '🛒',
        'Travel': '✈️',
        'Family': '👨‍👩‍👧‍👦'
    };
    return icons[category] || '🏷️';
}

function updateStats() {
    try {
        const filteredTodos = getFilteredTodos();
        const total = filteredTodos.length;
        const completed = filteredTodos.filter(t => t.completed).length;
        const pending = total - completed;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const overdue = filteredTodos.filter(todo => {
            if (todo.completed || !todo.dueDate) return false;
            const dueDate = new Date(todo.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate < today;
        }).length;
        
        if (totalTasks) totalTasks.textContent = total;
        if (completedTasks) completedTasks.textContent = completed;
        if (pendingTasks) pendingTasks.textContent = pending;
        if (overdueTasks) overdueTasks.textContent = overdue;
    } catch (error) {
        console.error('통계 업데이트 중 오류:', error);
    }
}

function toggleEmptyState() {
    if (!emptyState || !todoList) return;
    
    try {
        const filteredTodos = getFilteredTodos();
            
        if (filteredTodos.length === 0) {
            emptyState.classList.remove('hidden');
            todoList.style.display = 'none';
            
            const emptyIcon = emptyState.querySelector('.empty-icon');
            const emptyMessages = emptyState.querySelectorAll('p');
            
            if (emptyIcon && emptyMessages.length >= 2) {
                if (selectedDateFilter || currentFilters.search || currentFilters.category || currentFilters.status) {
                    emptyIcon.textContent = '🔍';
                    emptyMessages[0].textContent = currentLanguage === 'ko' ? '검색 결과가 없습니다!' : 'No search results!';
                    emptyMessages[1].textContent = currentLanguage === 'ko' ? '다른 검색어나 필터를 시도해보세요 ✨' : 'Try different search terms or filters ✨';
                } else {
                    emptyIcon.textContent = '📝';
                    emptyMessages[0].textContent = t('empty.no_todos');
                    emptyMessages[1].textContent = t('empty.add_todo');
                }
            }
        } else {
            emptyState.classList.add('hidden');
            todoList.style.display = 'block';
        }
    } catch (error) {
        console.error('빈 상태 토글 중 오류:', error);
    }
}

// ===========================================
// 대시보드 관리 함수들
// ===========================================

function toggleDashboard() {
    try {
        if (dashboard && dashboard.classList.contains('hidden')) {
            showDashboard();
        } else {
            hideDashboard();
        }
    } catch (error) {
        console.error('대시보드 전환 중 오류:', error);
    }
}

function showDashboard() {
    try {
        if (dashboard) {
            dashboard.classList.remove('hidden');
            updateDashboard();
            announceStatus(currentLanguage === 'ko' ? '통계 대시보드가 열렸습니다' : 'Statistics dashboard opened');
        }
    } catch (error) {
        console.error('대시보드 표시 중 오류:', error);
    }
}

function hideDashboard() {
    try {
        if (dashboard) {
            dashboard.classList.add('hidden');
            announceStatus(currentLanguage === 'ko' ? '통계 대시보드가 닫혔습니다' : 'Statistics dashboard closed');
        }
    } catch (error) {
        console.error('대시보드 숨김 중 오류:', error);
    }
}

function updateDashboard() {
    try {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        const today = formatDateString(new Date());
        const todayTasks = todos.filter(t => t.date === today).length;
        
        const dashTotalTasks = document.getElementById('dashTotalTasks');
        const dashCompletedTasks = document.getElementById('dashCompletedTasks');
        const dashProgress = document.getElementById('dashProgress');
        const dashTodayTasks = document.getElementById('dashTodayTasks');
        
        if (dashTotalTasks) dashTotalTasks.textContent = total;
        if (dashCompletedTasks) dashCompletedTasks.textContent = completed;
        if (dashProgress) dashProgress.textContent = progress + '%';
        if (dashTodayTasks) dashTodayTasks.textContent = todayTasks;
        
    } catch (error) {
        console.error('대시보드 업데이트 중 오류:', error);
    }
}

// ===========================================
// 다크모드 및 기타 UI 함수들
// ===========================================

function toggleDarkMode() {
    try {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        
        if (darkModeToggle) {
            darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        }
        
        updateDueDateDisplay();
        
        saveSettings();
        announceStatus(`${isDarkMode ? 
            (currentLanguage === 'ko' ? '다크' : 'Dark') : 
            (currentLanguage === 'ko' ? '라이트' : 'Light')} ${currentLanguage === 'ko' ? '모드로 전환되었습니다' : 'mode enabled'}`);
    } catch (error) {
        console.error('다크모드 전환 중 오류:', error);
    }
}

function showSuccessFeedback() {
    if (!addBtn) return;
    
    try {
        addBtn.style.background = 'linear-gradient(135deg, #68d391 0%, #48bb78 100%)';
        addBtn.textContent = '✨';
        
        setTimeout(() => {
            addBtn.style.background = '';
            addBtn.textContent = '✚';
        }, 1000);
    } catch (error) {
        console.error('성공 피드백 표시 중 오류:', error);
    }
}

function showInputError() {
    if (!todoInput) return;
    
    try {
        todoInput.style.borderColor = '#ff6b6b';
        todoInput.placeholder = currentLanguage === 'ko' ? '할 일을 입력해 주세요! 📝' : 'Please enter a todo! 📝';
        
        setTimeout(() => {
            todoInput.style.borderColor = '';
            todoInput.placeholder = t('todo.input_placeholder');
        }, 2000);
        
        announceStatus(currentLanguage === 'ko' ? '할 일 내용을 입력해 주세요' : 'Please enter todo content');
    } catch (error) {
        console.error('입력 오류 표시 중 오류:', error);
    }
}

function showCelebration() {
    try {
        if (addBtn) {
            addBtn.style.background = 'linear-gradient(135deg, #68d391 0%, #48bb78 100%)';
            addBtn.textContent = '🎉';
            
            setTimeout(() => {
                addBtn.style.background = '';
                addBtn.textContent = '✚';
            }, 1500);
        }
    } catch (error) {
        console.error('축하 효과 생성 중 오류:', error);
    }
}

function showErrorMessage(message) {
    try {
        alert(message);
    } catch (error) {
        console.error('에러 메시지 표시 중 오류:', error);
    }
}

function announceStatus(message) {
    try {
        if (statusUpdates) {
            statusUpdates.textContent = message;
            setTimeout(() => {
                statusUpdates.textContent = '';
            }, 1000);
        }
        console.log('상태:', message);
    } catch (error) {
        console.error('상태 알림 중 오류:', error);
    }
}

// ===========================================
// 데이터 관리 함수들
// ===========================================

function loadTodos() {
    try {
        const savedTodos = localStorage.getItem('todoManagerData');
        if (savedTodos) {
            todos = JSON.parse(savedTodos) || [];
            todos.forEach(todo => {
                if (!todo.date) todo.date = formatDateString(new Date());
                if (!todo.id) todo.id = todoIdCounter++;
                if (typeof todo.category === 'undefined') todo.category = '개인';
                if (typeof todo.priority === 'undefined') todo.priority = 2;
                if (typeof todo.order === 'undefined') todo.order = todos.length;
            });
            
            if (todos.length > 0) {
                todoIdCounter = Math.max(...todos.map(t => t.id || 0)) + 1;
            }
        }
        console.log('데이터 로드 완료:', todos.length, '개 항목');
    } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
        todos = [];
        showErrorMessage('저장된 데이터를 불러오는 중 오류가 발생했습니다');
    }
}

function saveTodos() {
    try {
        localStorage.setItem('todoManagerData', JSON.stringify(todos));
        console.log('데이터 저장 완료:', todos.length, '개 항목');
    } catch (error) {
        console.error('데이터를 저장하는 중 오류가 발생했습니다:', error);
        showErrorMessage('데이터를 저장하는 중 오류가 발생했습니다');
    }
}

function saveSettings() {
    try {
        const settings = {
            isDarkMode: isDarkMode,
            currentFilters: currentFilters,
            currentView: currentView,
            currentLanguage: currentLanguage,
            isNotificationsEnabled: isNotificationsEnabled,
            customCategories: customCategories
        };
        localStorage.setItem('todoManagerSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('설정 저장 중 오류:', error);
    }
}

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('todoManagerSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            if (!settings) return;
            
            if (typeof settings.isDarkMode === 'boolean') {
                isDarkMode = settings.isDarkMode;
                document.body.classList.toggle('dark-mode', isDarkMode);
                if (darkModeToggle) {
                    darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
                }
            }
            
            if (settings.currentLanguage) {
                currentLanguage = settings.currentLanguage;
            }
            
            if (typeof settings.isNotificationsEnabled === 'boolean') {
                isNotificationsEnabled = settings.isNotificationsEnabled;
            }
            
            if (settings.customCategories) {
                customCategories = settings.customCategories;
            }
            
            if (settings.currentFilters) {
                currentFilters = { ...currentFilters, ...settings.currentFilters };
                
                if (categoryFilter && settings.currentFilters.category) {
                    categoryFilter.value = settings.currentFilters.category;
                }
                if (statusFilter && settings.currentFilters.status) {
                    statusFilter.value = settings.currentFilters.status;
                }
                if (sortSelect && settings.currentFilters.sort) {
                    sortSelect.value = settings.currentFilters.sort;
                }
            }
            
            if (settings.currentView) {
                currentView = settings.currentView;
            }
        }
    } catch (error) {
        console.error('설정 불러오기 중 오류:', error);
    }
}

function exportTodos() {
    try {
        const data = {
            todos: todos,
            customCategories: customCategories,
            settings: {
                isDarkMode: isDarkMode,
                currentFilters: currentFilters,
                currentView: currentView,
                currentLanguage: currentLanguage,
                isNotificationsEnabled: isNotificationsEnabled
            },
            exportDate: new Date().toISOString(),
            version: '3.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `할일관리_백업_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        announceStatus(currentLanguage === 'ko' ? '데이터를 내보냈습니다' : 'Data exported successfully');
    } catch (error) {
        console.error('데이터 내보내기 중 오류:', error);
        showErrorMessage('데이터를 내보내는 중 오류가 발생했습니다');
    }
}

function importTodos(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.todos && Array.isArray(data.todos)) {
                    const confirmMessage = currentLanguage === 'ko' ? 
                        `${data.todos.length}개의 할 일을 가져오시겠습니까? 기존 데이터는 백업됩니다.` :
                        `Import ${data.todos.length} todos? Existing data will be backed up.`;
                    
                    const confirmed = confirm(confirmMessage);
                    
                    if (confirmed) {
                        localStorage.setItem('todoManagerBackup', JSON.stringify(todos));
                        
                        todos = data.todos;
                        
                        if (data.customCategories) {
                            customCategories = data.customCategories;
                            saveCustomCategories();
                            updateCategorySelects();
                        }
                        
                        if (todos.length > 0) {
                            todoIdCounter = Math.max(...todos.map(t => t.id || 0)) + 1;
                        }
                        
                        saveTodos();
                        saveSettings();
                        updateCalendarView();
                        updateUI();
                        
                        const successMessage = currentLanguage === 'ko' ? 
                            `${data.todos.length}개의 할 일을 가져왔습니다` :
                            `Imported ${data.todos.length} todos successfully`;
                        announceStatus(successMessage);
                    }
                } else {
                    throw new Error('Invalid backup file format');
                }
            } catch (error) {
                console.error('데이터 가져오기 중 오류:', error);
                const errorMessage = currentLanguage === 'ko' ? 
                    '올바른 형식의 백업 파일이 아닙니다' :
                    'Invalid backup file format';
                showErrorMessage(errorMessage);
            }
        };
        
        reader.readAsText(file);
        e.target.value = '';
    } catch (error) {
        console.error('파일 읽기 중 오류:', error);
        showErrorMessage('파일을 읽는 중 오류가 발생했습니다');
    }
}

// ===========================================
// 키보드 단축키
// ===========================================

function handleKeyboardShortcuts(e) {
    try {
        if (e.ctrlKey && e.key === 'Enter') {
            if (todoInput) {
                todoInput.focus();
                todoInput.select();
            }
        }
        
        if (e.key === 'Escape') {
            if (dashboard && !dashboard.classList.contains('hidden')) {
                hideDashboard();
            } else if (document.activeElement === todoInput && todoInput) {
                todoInput.value = '';
                todoInput.blur();
            } else if (document.activeElement === searchInput && searchInput) {
                clearSearch();
            }
        }
        
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleDarkMode();
        }
        
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            toggleDashboard();
        }
        
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            exportTodos();
        }
        
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            toggleLanguage();
        }
    } catch (error) {
        console.error('키보드 이벤트 처리 중 오류:', error);
    }
}

// ===========================================
// 유틸리티 함수들
// ===========================================

function formatDateString(date) {
    try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('날짜 형식 변환 중 오류:', error);
        return formatDateString(new Date());
    }
}

function parseLocalDate(dateString) {
    try {
        const parts = dateString.split('-').map(Number);
        if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
            throw new Error('잘못된 날짜 형식');
        }
        return new Date(parts[0], parts[1] - 1, parts[2]);
    } catch (error) {
        console.error('날짜 파싱 중 오류:', error, dateString);
        return new Date();
    }
}

// ===========================================
// 전역 에러 핸들링
// ===========================================

window.addEventListener('error', function(e) {
    console.error('전역 에러:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('처리되지 않은 Promise 거부:', e.reason);
});

window.addEventListener('beforeunload', function() {
    saveTodos();
    saveSettings();
});

console.log('할 일 관리 앱 스크립트 로드 완료! (모든 고급 기능 포함)');