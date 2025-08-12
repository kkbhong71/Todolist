// 전역 변수
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

// DOM 요소들
let todoInput, addBtn, todoList, emptyState, totalTasks, completedTasks, pendingTasks;
let searchInput, clearSearchBtn, categorySelect, prioritySelect, dueDateInput;
let categoryFilter, statusFilter, sortSelect, darkModeToggle, dashboardToggle;
let dashboard, closeDashboard, overdueTasks, dragGuide, statusUpdates;
let exportData, importBtn, importData;
let prevPeriodBtn, nextPeriodBtn, currentPeriodEl, weekGrid, monthGrid, yearGrid;
let todayBtn, selectedDateEl, weekViewContainer, monthViewContainer, yearViewContainer;
let weekViewBtn, monthViewBtn, yearViewBtn;

// DOMContentLoaded 이벤트
document.addEventListener('DOMContentLoaded', function() {
    console.log('앱 초기화 시작...');
    try {
        initializeElements();
        loadTodos();
        initializeEventListeners();
        initializeCalendar();
        loadSettings();
        
        // 오늘 날짜 설정
        if (dueDateInput) {
            dueDateInput.valueAsDate = new Date();
            updateDueDateDisplay(); // 초기 요일 표시
        }
        
        setTimeout(() => {
            updateUI();
            updateStats();
            updateCalendarView();
            announceStatus('할 일 관리 앱이 준비되었습니다');
            console.log('앱 초기화 완료!');
        }, 100);
    } catch (error) {
        console.error('앱 초기화 중 오류:', error);
        showErrorMessage('앱을 초기화하는 중 문제가 발생했습니다.');
    }
});

// DOM 요소 초기화
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
    categoryFilter = document.getElementById('categoryFilter');
    statusFilter = document.getElementById('statusFilter');
    sortSelect = document.getElementById('sortSelect');
    darkModeToggle = document.getElementById('darkModeToggle');
    dashboardToggle = document.getElementById('dashboardToggle');
    dashboard = document.getElementById('dashboard');
    closeDashboard = document.getElementById('closeDashboard');
    overdueTasks = document.getElementById('overdueTasks');
    dragGuide = document.getElementById('dragGuide');
    statusUpdates = document.getElementById('statusUpdates');
    exportData = document.getElementById('exportData');
    importBtn = document.getElementById('importBtn');
    importData = document.getElementById('importData');
    
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

// 마감일 표시 업데이트 함수 (수정된 버전 - input 필드에 직접 요일 표시)
function updateDueDateDisplay() {
    if (!dueDateInput || !dueDateInput.value) {
        // 기존 커스텀 디스플레이 제거
        const existingDisplay = dueDateInput.parentNode.querySelector('.custom-date-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        dueDateInput.style.display = 'block';
        return;
    }
    
    try {
        const date = new Date(dueDateInput.value);
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[date.getDay()];
        
        // 기존 커스텀 디스플레이 제거
        const existingDisplay = dueDateInput.parentNode.querySelector('.custom-date-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        
        // input 필드를 숨기고 커스텀 디스플레이 생성
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
        
        // 다크모드 스타일 적용
        if (document.body.classList.contains('dark-mode')) {
            customDisplay.style.background = 'rgba(255, 255, 255, 0.1)';
            customDisplay.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            customDisplay.style.color = '#e2e8f0';
        }
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}(${dayName})`;
        
        customDisplay.innerHTML = `
            <span>${formattedDate}</span>
            <span style="margin-left: 8px; color: #8B5A8C; font-size: 12px;">📅</span>
        `;
        
        // 클릭 시 잠시 input을 보여주고 blur 시 다시 커스텀으로 전환
        customDisplay.addEventListener('click', () => {
            customDisplay.style.display = 'none';
            dueDateInput.style.display = 'block';
            dueDateInput.focus();
            
            // blur 이벤트 리스너를 한 번만 등록
            const handleBlur = () => {
                setTimeout(() => {
                    updateDueDateDisplay();
                }, 100); // 약간의 지연을 두어 날짜 선택이 완료되도록 함
                dueDateInput.removeEventListener('blur', handleBlur);
            };
            
            dueDateInput.addEventListener('blur', handleBlur);
        });
        
        dueDateInput.parentNode.insertBefore(customDisplay, dueDateInput.nextSibling);
        
    } catch (error) {
        console.error('마감일 요일 표시 중 오류:', error);
    }
}

// 이벤트 리스너 초기화
function initializeEventListeners() {
    console.log('이벤트 리스너 초기화...');
    
    try {
        // 기본 기능
        if (addBtn) addBtn.addEventListener('click', addTodo);
        if (todoInput) {
            todoInput.addEventListener('keypress', handleKeyPress);
            todoInput.addEventListener('input', handleInputChange);
        }
        
        // 마감일 변경 시 요일 업데이트
        if (dueDateInput) {
            dueDateInput.addEventListener('change', updateDueDateDisplay);
            dueDateInput.addEventListener('blur', updateDueDateDisplay);
        }
        
        // 검색 기능
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }
        
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', clearSearch);
        }
        
        // 필터링
        if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
        if (statusFilter) statusFilter.addEventListener('change', applyFilters);
        if (sortSelect) sortSelect.addEventListener('change', applyFilters);
        
        // 다크모드
        if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);
        
        // 대시보드
        if (dashboardToggle) dashboardToggle.addEventListener('click', toggleDashboard);
        if (closeDashboard) closeDashboard.addEventListener('click', hideDashboard);
        
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
                announceStatus('오늘 날짜로 이동했습니다');
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
// 달력 기능 구현
// ===========================================

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
        // 버튼 활성화 상태 변경
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
        
        // 컨테이너 보이기/숨기기
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

// 기간 네비게이션
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

// 달력 뷰 업데이트
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

// 기간 제목 업데이트
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

// 주간 뷰 렌더링 (요일 표시 제거)
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
            
            // 오늘 날짜 체크
            if (date.getTime() === today.getTime()) {
                dateEl.classList.add('today');
            }
            
            // 선택된 날짜 체크
            if (selectedDateFilter === formatDateString(date)) {
                dateEl.classList.add('selected');
            }
            
            // 할 일이 있는 날짜 체크
            if (hasTasksOnDate(date)) {
                dateEl.classList.add('has-todos');
            }
            
            // 요일별 색상 적용
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0) { // 일요일
                dateEl.classList.add('sunday');
            } else if (dayOfWeek === 6) { // 토요일
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

// 월간 뷰 렌더링
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
        
        // 6주분 날짜 생성 (42일)
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateEl = document.createElement('div');
            dateEl.className = 'calendar-date';
            dateEl.setAttribute('data-date', formatDateString(date));
            
            // 현재 월이 아닌 날짜
            if (date.getMonth() !== month) {
                dateEl.classList.add('other-month');
            }
            
            // 오늘 날짜
            if (date.getTime() === today.getTime()) {
                dateEl.classList.add('today');
            }
            
            // 선택된 날짜
            if (selectedDateFilter === formatDateString(date)) {
                dateEl.classList.add('selected');
            }
            
            // 할 일이 있는 날짜
            if (hasTasksOnDate(date)) {
                dateEl.classList.add('has-todos');
            }
            
            // 요일별 색상 적용
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0) { // 일요일
                dateEl.classList.add('sunday');
            } else if (dayOfWeek === 6) { // 토요일
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

// 연간 뷰 렌더링
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
            
            // 요일 헤더
            const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
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
            
            // 6주분 날짜
            for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                
                const dateEl = document.createElement('div');
                dateEl.className = 'year-date';
                dateEl.setAttribute('data-date', formatDateString(date));
                
                if (date.getMonth() === month) {
                    // 현재 월의 날짜
                    
                    // 오늘 날짜
                    if (date.getTime() === today.getTime()) {
                        dateEl.classList.add('today');
                    }
                    
                    // 선택된 날짜
                    if (selectedDateFilter === formatDateString(date)) {
                        dateEl.classList.add('selected');
                    }
                    
                    // 할 일이 있는 날짜
                    if (hasTasksOnDate(date)) {
                        dateEl.classList.add('has-todos');
                    }
                    
                    // 요일별 색상 적용
                    const dayOfWeek = date.getDay();
                    if (dayOfWeek === 0) { // 일요일
                        dateEl.classList.add('sunday');
                    } else if (dayOfWeek === 6) { // 토요일
                        dateEl.classList.add('saturday');
                    }
                    
                    dateEl.textContent = date.getDate();
                    
                    dateEl.addEventListener('click', () => {
                        selectDate(date);
                    });
                    
                } else {
                    // 다른 월의 날짜는 투명하게 표시
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

// 유틸리티 함수들
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

function getDayName(dayIndex) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[dayIndex];
}

function hasTasksOnDate(date) {
    const dateStr = formatDateString(date);
    return todos.some(todo => todo.date === dateStr);
}

function selectDate(date) {
    try {
        const dateStr = formatDateString(date);
        
        if (selectedDateFilter === dateStr) {
            // 같은 날짜를 다시 클릭하면 필터 해제
            selectedDateFilter = null;
        } else {
            selectedDateFilter = dateStr;
            
            // 선택된 날짜에 맞게 마감일 입력 필드도 업데이트
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
                selectedText = `오늘 (${date.getMonth() + 1}월 ${date.getDate()}일)`;
            } else if (diffDays === 1) {
                selectedText = `내일 (${date.getMonth() + 1}월 ${date.getDate()}일)`;
            } else if (diffDays === -1) {
                selectedText = `어제 (${date.getMonth() + 1}월 ${date.getDate()}일)`;
            } else {
                selectedText = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
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
            
            // 오늘, 내일, 어제 표시 추가
            const diffTime = selectedDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
                dateText += ' (오늘)';
            } else if (diffDays === 1) {
                dateText += ' (내일)';
            } else if (diffDays === -1) {
                dateText += ' (어제)';
            }
            
            selectedDateEl.textContent = `${dateText} 할 일`;
        } else {
            selectedDateEl.textContent = '전체 할 일';
        }
    } catch (error) {
        console.error('선택된 날짜 표시 업데이트 중 오류:', error);
    }
}

// ===========================================
// 기본 기능들 (검색, 필터, CRUD 등)
// ===========================================

// Todo 리스트 이벤트 핸들링
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

// 드래그 앤 드롭 핸들링
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
    
    // 순서 업데이트
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

// 주요 Todo 조작 함수들
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
            } else {
                announceStatus(`할 일을 미완료로 변경했습니다: ${todo.text}`);
            }
        }
    } catch (error) {
        console.error('할 일 상태 변경 중 오류:', error);
        showErrorMessage('할 일 상태를 변경하는 중 오류가 발생했습니다');
    }
}

// 애니메이션과 함께 할 일 삭제
function deleteTodoWithAnimation(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    
    if (todoItem) {
        try {
            const todo = todos.find(t => t.id === id);
            const todoText = todo ? todo.text : '할 일';
            
            // 삭제 애니메이션 적용
            todoItem.style.transition = 'all 0.5s ease-out';
            todoItem.style.transform = 'translateX(-100%) scale(0.8)';
            todoItem.style.opacity = '0';
            todoItem.style.maxHeight = '0';
            todoItem.style.marginBottom = '0';
            todoItem.style.paddingTop = '0';
            todoItem.style.paddingBottom = '0';
            
            // 애니메이션 완료 후 실제 데이터 삭제
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

function deleteTodo(id) {
    // 기존 함수는 유지하되 애니메이션 버전 사용
    deleteTodoWithAnimation(id);
}

function editTodo(id) {
    try {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        
        const newText = prompt('할 일을 수정하세요:', todo.text);
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

// 검색 기능
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

// 할 일 추가
function addTodo() {
    if (!todoInput) return;
    
    try {
        const todoText = todoInput.value.trim();
        
        if (todoText === '') {
            showInputError();
            return;
        }
        
        // 선택된 날짜가 있으면 그 날짜로, 없으면 오늘 날짜로
        const todoDate = selectedDateFilter || formatDateString(new Date());
        const category = categorySelect ? categorySelect.value : '개인';
        const priority = prioritySelect ? parseInt(prioritySelect.value) : 2;
        const dueDate = dueDateInput ? dueDateInput.value : null;
        
        const newTodo = {
            id: todoIdCounter++,
            text: todoText,
            completed: false,
            date: todoDate,
            category: category,
            priority: priority,
            dueDate: dueDate,
            createdAt: new Date().toISOString(),
            order: todos.length
        };
        
        todos.push(newTodo);
        todoInput.value = '';
        
        // 입력 옵션 초기화 - 선택된 날짜가 있으면 그 날짜로 설정
        if (dueDateInput) {
            if (selectedDateFilter) {
                dueDateInput.value = selectedDateFilter;
            } else {
                dueDateInput.valueAsDate = new Date();
            }
            updateDueDateDisplay(); // 요일 표시 업데이트
        }
        
        showSuccessFeedback();
        saveTodos();
        updateCalendarView();
        updateUI();
        
        // 선택된 날짜 정보 포함하여 상태 알림
        const selectedDateText = selectedDateFilter ? 
            `${parseLocalDate(selectedDateFilter).getMonth() + 1}월 ${parseLocalDate(selectedDateFilter).getDate()}일에` : 
            '오늘에';
        announceStatus(`${selectedDateText} 새로운 할 일이 추가되었습니다: ${todoText} (${category})`);
    } catch (error) {
        console.error('할 일 추가 중 오류:', error);
        showErrorMessage('할 일을 추가하는 중 오류가 발생했습니다');
    }
}

// 필터 적용
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

// 할 일 목록 렌더링
function renderTodos() {
    if (!todoList) return;
    
    try {
        todoList.innerHTML = '';
        
        let filteredTodos = getFilteredTodos();
        filteredTodos = sortTodos(filteredTodos);
        
        filteredTodos.forEach((todo, index) => {
            const li = createTodoElement(todo, index);
            todoList.appendChild(li);
        });
        
        // 드래그 앤 드롭 안내
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

// 필터링된 할 일 목록 가져오기
function getFilteredTodos() {
    let filtered = todos;
    
    // 날짜 필터
    if (selectedDateFilter) {
        filtered = filtered.filter(todo => todo.date === selectedDateFilter);
    }
    
    // 검색 필터
    if (currentFilters.search) {
        filtered = filtered.filter(todo => 
            todo.text.toLowerCase().includes(currentFilters.search) ||
            (todo.category && todo.category.toLowerCase().includes(currentFilters.search))
        );
    }
    
    // 카테고리 필터
    if (currentFilters.category) {
        filtered = filtered.filter(todo => todo.category === currentFilters.category);
    }
    
    // 상태 필터
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

// 할 일 정렬
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
            
        default: // date
            return todos.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                }
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            });
    }
}

// 할 일 요소 생성
function createTodoElement(todo, index) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority || 2}`;
    li.setAttribute('data-id', todo.id);
    li.setAttribute('draggable', currentFilters.sort === 'manual');
    
    // 마감일 체크 - 수정된 날짜 계산 로직
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
    
    // 드래그 핸들
    if (currentFilters.sort === 'manual') {
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.textContent = '⋮⋮';
        li.appendChild(dragHandle);
    }
    
    // 체크박스
    const checkbox = document.createElement('div');
    checkbox.className = `todo-checkbox ${todo.completed ? 'checked' : ''}`;
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-checked', todo.completed);
    checkbox.setAttribute('tabindex', '0');
    if (todo.completed) {
        checkbox.textContent = '✓';
    }
    
    li.appendChild(checkbox);
    
    // 콘텐츠 영역
    const content = document.createElement('div');
    content.className = 'todo-content';
    
    const main = document.createElement('div');
    main.className = 'todo-main';
    
    // 우선순위 아이콘
    const priority = document.createElement('span');
    priority.className = 'todo-priority';
    priority.title = '우선순위';
    const priorityIcon = {
        3: '🔴',
        2: '🟡',
        1: '🟢'
    }[todo.priority || 2];
    priority.textContent = priorityIcon;
    
    // 카테고리 아이콘
    const category = document.createElement('span');
    category.className = 'todo-category';
    category.title = `카테고리: ${todo.category}`;
    const categoryIcon = {
        '개인': '🙋‍♂️',
        '업무': '💼',
        '취미': '🎨',
        '건강': '💪',
        '학습': '📚',
        '쇼핑': '🛒'
    }[todo.category] || '📝';
    category.textContent = categoryIcon;
    
    // 텍스트
    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;
    
    main.appendChild(priority);
    main.appendChild(category);
    main.appendChild(text);
    
    // 메타 정보
    const meta = document.createElement('div');
    meta.className = 'todo-meta';
    
    // 날짜 정보 (선택된 날짜가 없을 때만 표시)
    if (!selectedDateFilter) {
        const todoDate = parseLocalDate(todo.date);
        const diffTime = todoDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'todo-date';
        
        if (diffDays === 0) {
            dateSpan.className += ' today-date';
            dateSpan.textContent = '오늘';
        } else if (diffDays === 1) {
            dateSpan.className += ' tomorrow-date';
            dateSpan.textContent = '내일';
        } else if (diffDays === -1) {
            dateSpan.className += ' yesterday-date';
            dateSpan.textContent = '어제';
        } else if (diffDays > 1) {
            dateSpan.className += ' future-date';
            dateSpan.textContent = `${diffDays}일 후`;
        } else {
            dateSpan.className += ' past-date';
            dateSpan.textContent = `${Math.abs(diffDays)}일 전`;
        }
        
        meta.appendChild(dateSpan);
    } else {
        // 선택된 날짜가 있을 때는 해당 날짜 정보 표시
        const todoDate = parseLocalDate(todo.date);
        const selectedDate = parseLocalDate(selectedDateFilter);
        
        // 선택된 날짜와 할 일 날짜가 다른 경우에만 표시
        if (todo.date !== selectedDateFilter) {
            const dateSpan = document.createElement('span');
            dateSpan.className = 'todo-date other-date';
            dateSpan.textContent = `${todoDate.getMonth() + 1}/${todoDate.getDate()}`;
            dateSpan.style.opacity = '0.7';
            meta.appendChild(dateSpan);
        }
    }
    
    // 마감일 정보 (수정된 부분 - 정확한 날짜 계산)
    if (todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const dueDiffTime = dueDate.getTime() - today.getTime();
        const dueDiffDays = Math.floor(dueDiffTime / (1000 * 60 * 60 * 24));
        
        // 요일 이름 배열
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[dueDate.getDay()];
        
        // 날짜 포맷팅 (YYYY-MM-DD(요일) 형태)
        const year = dueDate.getFullYear();
        const month = String(dueDate.getMonth() + 1).padStart(2, '0');
        const day = String(dueDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}(${dayName})`;
        
        const dueDateSpan = document.createElement('span');
        dueDateSpan.className = 'due-date';
        
        let dueDateText = '';
        
        if (dueDiffDays < 0) {
            dueDateSpan.className += ' overdue-date';
            dueDateText = `${formattedDate} - ${Math.abs(dueDiffDays)}일 지연`;
        } else if (dueDiffDays === 0) {
            dueDateSpan.className += ' due-today';
            dueDateText = `${formattedDate} - 오늘 마감`;
        } else if (dueDiffDays === 1) {
            dueDateSpan.className += ' due-tomorrow';
            dueDateText = `${formattedDate} - 내일 마감`;
        } else {
            dueDateText = `${formattedDate} - ${dueDiffDays}일 후 마감`;
        }
        
        dueDateSpan.textContent = `⏰ ${dueDateText}`;
        meta.appendChild(dueDateSpan);
    }
    
    content.appendChild(main);
    content.appendChild(meta);
    li.appendChild(content);
    
    // 액션 버튼들
    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    
    // 편집 버튼
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.title = '수정';
    editBtn.setAttribute('aria-label', '할 일 수정');
    editBtn.textContent = '✏️';
    
    // 삭제 버튼
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = '삭제';
    deleteBtn.setAttribute('aria-label', '할 일 삭제');
    deleteBtn.textContent = '🗑️';
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(actions);
    
    return li;
}

// 다크모드
function toggleDarkMode() {
    try {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        
        if (darkModeToggle) {
            darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        }
        
        // 다크모드 전환 시 커스텀 날짜 디스플레이 스타일 업데이트
        updateDueDateDisplay();
        
        saveSettings();
        announceStatus(`${isDarkMode ? '다크' : '라이트'} 모드로 전환되었습니다`);
    } catch (error) {
        console.error('다크모드 전환 중 오류:', error);
    }
}

// 통계 대시보드
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
            announceStatus('통계 대시보드가 열렸습니다');
        }
    } catch (error) {
        console.error('대시보드 표시 중 오류:', error);
    }
}

function hideDashboard() {
    try {
        if (dashboard) {
            dashboard.classList.add('hidden');
            announceStatus('통계 대시보드가 닫혔습니다');
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
        if (dashProgress) dashProgress.textContent = progress;
        if (dashTodayTasks) dashTodayTasks.textContent = todayTasks;
        
    } catch (error) {
        console.error('대시보드 업데이트 중 오류:', error);
    }
}

// 기본 이벤트 핸들러들
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

// UI 업데이트
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
                    emptyMessages[0].textContent = '검색 결과가 없습니다!';
                    emptyMessages[1].textContent = '다른 검색어나 필터를 시도해보세요 ✨';
                } else {
                    emptyIcon.textContent = '📝';
                    emptyMessages[0].textContent = '등록된 할 일이 없습니다!';
                    emptyMessages[1].textContent = '위에서 새로운 할 일을 추가해보세요 ✨';
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

// 통계 업데이트
function updateStats() {
    try {
        const filteredTodos = getFilteredTodos();
        const total = filteredTodos.length;
        const completed = filteredTodos.filter(t => t.completed).length;
        const pending = total - completed;
        
        // 지연된 할 일 계산
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const overdue = filteredTodos.filter(todo => {
            if (todo.completed || !todo.dueDate) return false;
            const dueDate = new Date(todo.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            return dueDate < today;
        }).length;
        
        // 숫자 업데이트
        if (totalTasks) totalTasks.textContent = total;
        if (completedTasks) completedTasks.textContent = completed;
        if (pendingTasks) pendingTasks.textContent = pending;
        if (overdueTasks) overdueTasks.textContent = overdue;
    } catch (error) {
        console.error('통계 업데이트 중 오류:', error);
    }
}

// 유틸리티 함수들
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

// 로컬 스토리지 함수들
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

// 설정 저장/불러오기
function saveSettings() {
    try {
        const settings = {
            isDarkMode: isDarkMode,
            currentFilters: currentFilters,
            currentView: currentView
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
            
            if (settings.currentFilters) {
                currentFilters = { ...currentFilters, ...settings.currentFilters };
                
                // UI에 필터 상태 반영
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

// 피드백 및 에러 처리 함수들
function showInputError() {
    if (!todoInput) return;
    
    try {
        todoInput.style.borderColor = '#ff6b6b';
        todoInput.placeholder = '할 일을 입력해 주세요! 📝';
        
        setTimeout(() => {
            todoInput.style.borderColor = '';
            todoInput.placeholder = '할 일을 입력하세요 📝';
        }, 2000);
        
        announceStatus('할 일 내용을 입력해 주세요');
    } catch (error) {
        console.error('입력 오류 표시 중 오류:', error);
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

// 축하 효과
function showCelebration() {
    try {
        // 간단한 축하 메시지
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

// 데이터 관리 기능들
function exportTodos() {
    try {
        const data = {
            todos: todos,
            settings: {
                isDarkMode: isDarkMode,
                currentFilters: currentFilters,
                currentView: currentView
            },
            exportDate: new Date().toISOString(),
            version: '2.1'
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
        announceStatus('데이터를 내보냈습니다');
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
                    const confirmed = confirm(`${data.todos.length}개의 할 일을 가져오시겠습니까? 기존 데이터는 백업됩니다.`);
                    
                    if (confirmed) {
                        // 기존 데이터 백업
                        localStorage.setItem('todoManagerBackup', JSON.stringify(todos));
                        
                        // 새 데이터 적용
                        todos = data.todos;
                        
                        // ID 카운터 업데이트
                        if (todos.length > 0) {
                            todoIdCounter = Math.max(...todos.map(t => t.id || 0)) + 1;
                        }
                        
                        saveTodos();
                        saveSettings();
                        updateCalendarView();
                        updateUI();
                        
                        announceStatus(`${data.todos.length}개의 할 일을 가져왔습니다`);
                    }
                } else {
                    throw new Error('올바른 형식의 백업 파일이 아닙니다');
                }
            } catch (error) {
                console.error('데이터 가져오기 중 오류:', error);
                showErrorMessage('올바른 형식의 백업 파일이 아닙니다');
            }
        };
        
        reader.readAsText(file);
        e.target.value = '';
    } catch (error) {
        console.error('파일 읽기 중 오류:', error);
        showErrorMessage('파일을 읽는 중 오류가 발생했습니다');
    }
}

// 키보드 단축키
function handleKeyboardShortcuts(e) {
    try {
        // Ctrl + Enter: 할 일 입력창 포커스
        if (e.ctrlKey && e.key === 'Enter') {
            if (todoInput) {
                todoInput.focus();
                todoInput.select();
            }
        }
        
        // ESC: 입력창 클리어 또는 대시보드 닫기
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
        
        // Ctrl + F: 검색창 포커스
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Ctrl + Shift + D: 다크모드 토글
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleDarkMode();
        }
        
        // Ctrl + Shift + S: 통계 대시보드 토글
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            toggleDashboard();
        }
        
        // Ctrl + S: 데이터 내보내기
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            exportTodos();
        }
    } catch (error) {
        console.error('키보드 이벤트 처리 중 오류:', error);
    }
}

// 전역 에러 핸들링
window.addEventListener('error', function(e) {
    console.error('전역 에러:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('처리되지 않은 Promise 거부:', e.reason);
});

// 페이지 언로드 시 데이터 저장
window.addEventListener('beforeunload', function() {
    saveTodos();
    saveSettings();
});

console.log('할 일 관리 앱 스크립트 로드 완료! (모든 문제 해결 버전)');