// 知识库管理系统
class KnowledgeBase {
    constructor() {
        // 安全工具类
        this.security = {
            // 输入验证规则
            validationRules: {
                title: {
                    maxLength: 200,
                    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5\s\-_.,!?()]+$/,
                    allowedTags: []
                },
                description: {
                    maxLength: 1000,
                    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5\s\-_.,!?()\n\r]+$/,
                    allowedTags: ['p', 'br', 'strong', 'em', 'u']
                },
                tags: {
                    maxLength: 50,
                    pattern: /^[a-zA-Z0-9\u4e00-\u9fa5\s\-_]+$/,
                    maxCount: 10
                },
                url: {
                    pattern: /^https?:\/\/[^\s<>"{}|\\^`\[\]]+$/i
                }
            },
            
            // 敏感词过滤
            sensitiveWords: [
                'script', 'javascript:', 'vbscript:', 'onload', 'onerror', 'onclick',
                'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit',
                'eval(', 'document.cookie', 'window.location', 'innerHTML',
                'outerHTML', 'insertAdjacentHTML', 'createElement'
            ],
            
            // 文件类型白名单
            allowedFileTypes: [
                'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                'application/pdf', 'application/msword', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain', 'text/html', 'text/css', 'text/javascript',
                'video/mp4', 'video/webm', 'video/ogg'
            ],
            
            // 最大文件大小 (50MB)
            maxFileSize: 50 * 1024 * 1024,
            
            // 安全配置
            config: {
                // 会话超时时间（分钟）
                sessionTimeout: 30,
                // 最大登录尝试次数
                maxLoginAttempts: 5,
                // 密码最小长度
                minPasswordLength: 8,
                // 是否启用数据加密
                enableEncryption: false,
                // 是否启用审计日志
                enableAuditLog: true
            },
            
            // 审计日志
            auditLog: []
        };
        
        this.data = {
            documents: [],
            images: [],
            videos: [],
            links: [],
            notes: [],
            // 新增：自定义图片分类
            imageCategories: [
                { id: 'general', name: '通用', description: '默认分类', color: '#6366f1', icon: 'fas fa-folder' },
                { id: 'anime', name: '动漫角色', description: '动漫人物图片', color: '#f472b6', icon: 'fas fa-heart' },
                { id: 'landscape', name: '风景', description: '风景照片', color: '#10b981', icon: 'fas fa-mountain' },
                { id: 'design', name: '设计素材', description: '设计和素材图片', color: '#f59e0b', icon: 'fas fa-palette' },
                { id: 'screenshot', name: '截图', description: '屏幕截图', color: '#8b5cf6', icon: 'fas fa-desktop' },
                { id: 'life', name: '生活', description: '日常生活照片', color: '#ef4444', icon: 'fas fa-camera' }
            ],
            // 新增：标签管理
            imageTags: [],
            // 新增：图片笔记关联
            imageNoteAssociations: [],
            // 新增：链接标签管理
            linkTags: [],
            // 新增：链接分类管理
            linkCategories: [
                { id: 'general', name: '通用', description: '默认分类', color: '#6366f1' },
                { id: 'tech', name: '技术博客', description: '技术相关的博客和文章', color: '#10b981' },
                { id: 'design', name: '设计资源', description: '设计灵感和资源', color: '#f59e0b' },
                { id: 'tools', name: '工具软件', description: '实用工具和软件', color: '#8b5cf6' },
                { id: 'learning', name: '学习资料', description: '在线课程和教程', color: '#ef4444' },
                { id: 'entertainment', name: '娱乐休闲', description: '娱乐和休闲内容', color: '#06b6d4' }
            ],
            // 新增：自定义文件夹管理
            linkFolders: [
                { 
                    id: 'default', 
                    name: '默认文件夹', 
                    description: '系统默认文件夹', 
                    color: '#6366f1', 
                    icon: 'fas fa-folder',
                    isEncrypted: false,
                    password: null,
                    isDefault: true,
                    createdAt: new Date().toISOString(),
                    linkCount: 0
                }
            ],
            // 新增：文件夹访问状态
            folderAccessStates: {},
            // 新增：搜索历史
            searchHistory: []
        };
        
        this.currentSection = 'dashboard';
        this.theme = localStorage.getItem('theme') || 'light';
        
        // 图片预览相关状态
        this.previewModal = null;
        this.currentImageIndex = 0;
        this.currentImages = [];
        this.currentZoom = 1;
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.imagePosition = { x: 0, y: 0 };
        
        // 文档预览相关状态
        this.documentPreviewModal = null;
        this.currentDocument = null;
        
        // 图片批量操作相关状态
        this.bulkMode = false;
        this.selectedImages = new Set();
        this.draggedImage = null;
        this.draggedImageElement = null;
        this.sortOrder = [];
        
        // 链接批量操作相关状态
        this.linkBulkMode = false;
        this.selectedLinks = new Set();
        
        // 新增：图片管理相关状态
        this.imageDetailModal = null;
        this.currentImageCategory = 'general';
        this.imageCompressionQuality = 0.8; // 压缩质量
        this.maxCompressedWidth = 1920; // 压缩图最大宽度
        this.maxCompressedHeight = 1080; // 压缩图最大高度
        
        // 新增：文件夹管理相关状态
        this.currentFolder = 'default'; // 当前选中的文件夹
        this.folderViewMode = 'grid'; // 文件夹查看模式：grid 或 list
        this.isDraggingLink = false; // 是否正在拖拽链接
        this.draggedLinkId = null; // 被拖拽的链接ID
        
        this.init();
    }
    
    // 强制更新链接统计显示 - 增强版本
    forceUpdateLinksStats() {
        console.log('🔄 强制更新链接统计显示');
        
        // 多重尝试策略
        const attemptUpdate = (attempt = 1) => {
            // 直接获取DOM元素并更新
            const totalLinksElement = document.getElementById('totalLinksCount');
            const totalFoldersElement = document.getElementById('totalFoldersCount');
            const totalTagsElement = document.getElementById('totalTagsCount');
            
            if (!totalLinksElement || !totalFoldersElement || !totalTagsElement) {
                console.warn(`⚠️ 统计DOM元素未找到 (尝试 ${attempt}/5)`);
                if (attempt < 5) {
                    setTimeout(() => attemptUpdate(attempt + 1), 200 * attempt);
                }
                return;
            }
            
            // 计算统计数据
            const linksCount = this.data.links ? this.data.links.length : 0;
            const foldersCount = this.data.linkFolders ? this.data.linkFolders.length : 0;
            
            // 计算标签数量
            const allTags = new Set();
            if (this.data.links && Array.isArray(this.data.links)) {
                this.data.links.forEach(link => {
                    if (link.tags && Array.isArray(link.tags)) {
                        link.tags.forEach(tag => {
                            if (tag && tag.trim()) {
                                allTags.add(tag.trim());
                            }
                        });
                    }
                });
            }
            const tagsCount = allTags.size;
            
            console.log('📊 统计数据:', { 链接: linksCount, 文件夹: foldersCount, 标签: tagsCount });
            
            // 直接更新DOM元素 - 强制赋值
            totalLinksElement.textContent = linksCount.toString();
            totalLinksElement.innerText = linksCount.toString();
            totalLinksElement.innerHTML = linksCount.toString();
            
            totalFoldersElement.textContent = foldersCount.toString();
            totalFoldersElement.innerText = foldersCount.toString();
            totalFoldersElement.innerHTML = foldersCount.toString();
            
            totalTagsElement.textContent = tagsCount.toString();
            totalTagsElement.innerText = tagsCount.toString();
            totalTagsElement.innerHTML = tagsCount.toString();
            
            // 确保元素可见
            [totalLinksElement, totalFoldersElement, totalTagsElement].forEach(el => {
                el.style.display = 'inline';
                el.style.visibility = 'visible';
                el.style.opacity = '1';
                el.style.color = 'inherit';
                el.style.fontSize = 'inherit';
                el.style.fontWeight = 'inherit';
            });
            
            // 确保统计卡片容器可见
            const statsContainer = document.querySelector('.link-stats');
            if (statsContainer) {
                statsContainer.style.display = 'block';
                statsContainer.style.visibility = 'visible';
                statsContainer.style.opacity = '1';
            }
            
            // 触发DOM更新事件
            [totalLinksElement, totalFoldersElement, totalTagsElement].forEach(el => {
                el.dispatchEvent(new Event('DOMSubtreeModified', { bubbles: true }));
            });
            
            console.log('✅ 强制更新完成');
            
            // 额外验证：检查更新是否真的生效
            setTimeout(() => {
                const currentLinks = document.getElementById('totalLinksCount').textContent;
                const currentFolders = document.getElementById('totalFoldersCount').textContent;
                const currentTags = document.getElementById('totalTagsCount').textContent;
                
                if (currentLinks !== linksCount.toString() || 
                    currentFolders !== foldersCount.toString() || 
                    currentTags !== tagsCount.toString()) {
                    console.warn('⚠️ 统计更新被覆盖，重新更新');
                    this.forceUpdateLinksStats();
                }
            }, 500);
        };
        
        attemptUpdate();
    }
    
    // 初始化系统
    init() {
        this.loadData();
        this.loadAuditLog();
        this.loadSortOrder(); // 加载图片排序
        this.setupEventListeners();
        this.setupTheme();
        this.updateStats();
        
        // 记录应用启动事件
        this.logAuditEvent('app_started', {
            version: '1.0.0',
            userAgent: navigator.userAgent
        });
        
        // 如果没有链接数据，添加一些默认数据进行测试
        if (this.data.links.length === 0) {
            this.addDefaultLinksForTesting();
        }
        
        // 添加额外测试数据确保统计正常
        this.addDefaultTestData();
        
        // 初始化时更新链接统计 - 使用多重保障
        console.log('🚀 系统初始化完成，开始更新链接统计');
        this.updateLinksPageStats();
        
        // 确保在DOM完全加载后再次更新
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('📄 DOM加载完成，再次更新链接统计');
                this.updateLinksPageStats();
            });
        } else {
            // DOM已经加载完成
            setTimeout(() => {
                console.log('📄 DOM已就绪，再次更新链接统计');
                this.updateLinksPageStats();
            }, 100);
        }
        
        this.showRecentItems();
    }
    
    // 启动统计更新保障机制 - 确保统计信息始终正确显示
    startStatsUpdateGuard() {
        console.log('🛡️ 启动统计更新保障机制');
        
        // 清除已有的保障定时器
        if (this.statsGuardTimer) {
            clearInterval(this.statsGuardTimer);
        }
        
        // 设置保障定时器 - 每2秒检查一次统计显示
        this.statsGuardTimer = setInterval(() => {
            // 只在链接页面激活时才进行保障
            if (this.currentSection === 'links') {
                const totalLinksElement = document.getElementById('totalLinksCount');
                const totalFoldersElement = document.getElementById('totalFoldersCount');
                const totalTagsElement = document.getElementById('totalTagsCount');
                
                if (totalLinksElement && totalFoldersElement && totalTagsElement) {
                    const currentLinksText = totalLinksElement.textContent || '';
                    const currentFoldersText = totalFoldersElement.textContent || '';
                    const currentTagsText = totalTagsElement.textContent || '';
                    
                    // 检查是否为空或者不正确
                    const expectedLinks = (this.data.links ? this.data.links.length : 0).toString();
                    const expectedFolders = (this.data.linkFolders ? this.data.linkFolders.length : 0).toString();
                    
                    const allTags = new Set();
                    if (this.data.links && Array.isArray(this.data.links)) {
                        this.data.links.forEach(link => {
                            if (link.tags && Array.isArray(link.tags)) {
                                link.tags.forEach(tag => {
                                    if (tag && tag.trim()) {
                                        allTags.add(tag.trim());
                                    }
                                });
                            }
                        });
                    }
                    const expectedTags = allTags.size.toString();
                    
                    if (currentLinksText !== expectedLinks || 
                        currentFoldersText !== expectedFolders || 
                        currentTagsText !== expectedTags ||
                        currentLinksText === '' || currentFoldersText === '' || currentTagsText === '') {
                        
                        console.log('🔧 检测到统计显示异常，自动修复:', {
                            当前显示: { 链接: currentLinksText, 文件夹: currentFoldersText, 标签: currentTagsText },
                            期望显示: { 链接: expectedLinks, 文件夹: expectedFolders, 标签: expectedTags }
                        });
                        
                        this.forceUpdateLinksStats();
                    }
                }
            }
        }, 2000);
        
        // 页面隐藏时清除保障定时器
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.statsGuardTimer) {
                console.log('🛡️ 页面隐藏，暂停统计保障机制');
                clearInterval(this.statsGuardTimer);
                this.statsGuardTimer = null;
            } else if (!document.hidden && this.currentSection === 'links') {
                console.log('🛡️ 页面显示，重启统计保障机制');
                this.startStatsUpdateGuard();
            }
        });
    }
    
    // 转义HTML字符，防止XSS攻击
    escapeHtml(text) {
        if (typeof text !== 'string') {
            return text;
        }
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // 增强的XSS防护 - 过滤敏感内容
    sanitizeInput(input, type = 'text') {
        if (typeof input !== 'string') {
            return input;
        }
        
        // 移除或转义危险字符
        let sanitized = input
            .replace(/[<>]/g, (match) => {
                return match === '<' ? '&lt;' : '&gt;';
            })
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/&/g, '&amp;');
        
        // 过滤敏感词
        this.security.sensitiveWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            sanitized = sanitized.replace(regex, '[已过滤]');
        });
        
        // 根据类型进行额外验证
        if (type === 'url') {
            if (!this.security.validationRules.url.pattern.test(sanitized)) {
                throw new Error('URL格式不正确');
            }
        }
        
        return sanitized;
    }
    
    // 验证输入内容
    validateInput(input, fieldType) {
        const rules = this.security.validationRules[fieldType];
        if (!rules) {
            return { isValid: true, message: '' };
        }
        
        if (typeof input !== 'string') {
            return { isValid: false, message: '输入内容必须是文本' };
        }
        
        // 长度检查
        if (rules.maxLength && input.length > rules.maxLength) {
            return { 
                isValid: false, 
                message: `内容长度不能超过${rules.maxLength}个字符` 
            };
        }
        
        // 模式检查
        if (rules.pattern && !rules.pattern.test(input)) {
            return { 
                isValid: false, 
                message: '输入内容包含不允许的字符' 
            };
        }
        
        // 标签数量检查（针对标签字段）
        if (fieldType === 'tags' && rules.maxCount) {
            const tags = input.split(',').filter(tag => tag.trim());
            if (tags.length > rules.maxCount) {
                return { 
                    isValid: false, 
                    message: `标签数量不能超过${rules.maxCount}个` 
                };
            }
        }
        
        return { isValid: true, message: '' };
    }
    
    // 安全的HTML内容处理
    sanitizeHtml(html, allowedTags = []) {
        if (typeof html !== 'string') {
            return html;
        }
        
        // 创建临时DOM元素
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 移除所有script标签
        const scripts = tempDiv.querySelectorAll('script');
        scripts.forEach(script => script.remove());
        
        // 移除所有事件处理器
        const allElements = tempDiv.querySelectorAll('*');
        allElements.forEach(element => {
            const attributes = element.attributes;
            for (let i = attributes.length - 1; i >= 0; i--) {
                const attr = attributes[i];
                if (attr.name.startsWith('on') || attr.name === 'javascript:') {
                    element.removeAttribute(attr.name);
                }
            }
        });
        
        // 只保留允许的标签
        if (allowedTags.length > 0) {
            const allowedElements = tempDiv.querySelectorAll('*');
            allowedElements.forEach(element => {
                if (!allowedTags.includes(element.tagName.toLowerCase())) {
                    // 保留内容，移除标签
                    const parent = element.parentNode;
                    while (element.firstChild) {
                        parent.insertBefore(element.firstChild, element);
                    }
                    parent.removeChild(element);
                }
            });
        }
        
        return tempDiv.innerHTML;
    }
    
    // 验证文件类型
    validateFileType(file) {
        return this.security.allowedFileTypes.includes(file.type);
    }
    
    // 验证文件大小
    validateFileSize(file) {
        return file.size <= this.security.maxFileSize;
    }
    
    // 安全的文件上传处理
    secureFileUpload(file) {
        // 验证文件类型
        if (!this.validateFileType(file)) {
            this.logAuditEvent('file_rejected', {
                reason: 'unsupported_type',
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size
            });
            throw new Error('不支持的文件类型');
        }
        
        // 验证文件大小
        if (!this.validateFileSize(file)) {
            this.logAuditEvent('file_rejected', {
                reason: 'file_too_large',
                fileName: file.name,
                fileSize: file.size,
                maxSize: this.security.maxFileSize
            });
            throw new Error(`文件大小不能超过${this.formatFileSize(this.security.maxFileSize)}`);
        }
        
        // 验证文件名
        const fileName = this.sanitizeInput(file.name, 'filename');
        if (fileName !== file.name) {
            this.logAuditEvent('file_rejected', {
                reason: 'invalid_filename',
                fileName: file.name,
                sanitizedName: fileName
            });
            throw new Error('文件名包含不允许的字符');
        }
        
        // 记录成功的文件验证
        this.logAuditEvent('file_validated', {
            fileName: fileName,
            fileType: file.type,
            fileSize: file.size
        });
        
        return {
            originalFile: file,
            sanitizedName: fileName,
            isSafe: true
        };
    }
    
    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // 记录审计日志
    logAuditEvent(event, details = {}) {
        if (!this.security.config.enableAuditLog) return;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.security.auditLog.push(logEntry);
        
        // 限制日志数量，保留最近1000条
        if (this.security.auditLog.length > 1000) {
            this.security.auditLog = this.security.auditLog.slice(-1000);
        }
        
        // 保存到localStorage
        this.saveAuditLog();
    }
    
    // 保存审计日志
    saveAuditLog() {
        try {
            localStorage.setItem('auditLog', JSON.stringify(this.security.auditLog));
        } catch (error) {
            console.warn('审计日志保存失败:', error);
        }
    }
    
    // 加载审计日志
    loadAuditLog() {
        try {
            const saved = localStorage.getItem('auditLog');
            if (saved) {
                this.security.auditLog = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('审计日志加载失败:', error);
            this.security.auditLog = [];
        }
    }
    
    // 获取安全报告
    getSecurityReport() {
        const report = {
            timestamp: new Date().toISOString(),
            securityFeatures: {
                xssProtection: true,
                inputValidation: true,
                fileUploadValidation: true,
                dataSanitization: true,
                auditLogging: this.security.config.enableAuditLog
            },
            recentEvents: this.security.auditLog.slice(-10),
            fileUploadStats: {
                totalUploads: this.security.auditLog.filter(log => log.event === 'file_upload').length,
                rejectedUploads: this.security.auditLog.filter(log => log.event === 'file_rejected').length
            },
            dataIntegrity: {
                totalItems: this.data.documents.length + this.data.images.length + 
                           this.data.videos.length + this.data.links.length + this.data.notes.length,
                lastBackup: localStorage.getItem('lastBackupDate') || '从未备份'
            }
        };
        
        return report;
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 导航链接
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                
                // 如果是链接页面，强制更新统计
                if (section === 'links') {
                    console.log('🔄 切换到链接页面，开始更新统计');
                    // 使用新的多重保障更新策略
                    this.updateLinksPageStats();
                    
                    // 强制更新统计显示
                    setTimeout(() => {
                        this.forceUpdateLinksStats();
                    }, 100);
                    
                    // 额外保障：确保在页面完全渲染后再次更新
                    setTimeout(() => {
                        this.forceUpdateLinksStats();
                    }, 300);
                }
                
                // 如果是搜索页面，自动聚焦到搜索框
                if (section === 'search') {
                    setTimeout(() => {
                        const searchInput = document.getElementById('globalSearch');
                        if (searchInput) {
                            searchInput.focus();
                        }
                    }, 100);
                }
            });
        });

        // 仪表盘统计卡片点击跳转
        document.querySelectorAll('.clickable-stat').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const section = card.dataset.section;
                
                if (section) {
                    // 添加点击动效
                    card.style.transform = 'translateY(-2px) scale(0.98)';
                    setTimeout(() => {
                        card.style.transform = '';
                    }, 150);
                    
                    // 跳转到对应页面
                    this.showSection(section);
                    
                    // 显示跳转提示
                    const sectionNames = {
                        'documents': '文档资料',
                        'images': '图片收藏',
                        'videos': '视频资源',
                        'links': '链接收藏'
                    };
                    
                    this.showToast('跳转', `已切换到${sectionNames[section]}页面`, 'info');
                    
                    // 如果是链接页面，强制更新统计
                    if (section === 'links') {
                        this.updateLinksPageStats();
                        setTimeout(() => this.forceUpdateLinksStats(), 100);
                    }
                }
            });
        });
        
        // 移动端侧边栏切换
        const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        mobileSidebarToggle?.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
        
        sidebarToggle?.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            this.closeModal();
        });
        
        // 主题切换
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // 添加内容按钮
        document.getElementById('addContent').addEventListener('click', () => {
            this.showAddContentModal();
        });
        
        // 全局搜索
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            const query = e.target.value.trim();
            const searchBar = e.target.closest('.search-bar');
            
            // 动态添加/移除样式类
            if (query) {
                searchBar.classList.add('has-content');
            } else {
                searchBar.classList.remove('has-content');
            }
            
            // 如果当前在搜索页面且有搜索词，自动执行搜索
            if (this.currentSection === 'search' && query) {
                this.performAdvancedSearch();
            } else {
                this.performGlobalSearch(query);
            }
            
            this.showSearchSuggestions(query);
        });
        
        // 新增：搜索框Enter键事件
        document.getElementById('globalSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = e.target.value.trim();
                if (query) {
                    // 切换到搜索页面
                    this.showSection('search');
                    // 执行搜索
                    this.performAdvancedSearch();
                }
            }
        });
        
        // 新增：搜索按钮点击事件
        document.getElementById('searchBtn')?.addEventListener('click', () => {
            const searchInput = document.getElementById('globalSearch');
            const query = searchInput.value.trim();
            if (query) {
                // 切换到搜索页面
                this.showSection('search');
                // 执行搜索
                this.performAdvancedSearch();
            }
        });
        
        // 搜索框焦点事件
        document.getElementById('globalSearch').addEventListener('focus', (e) => {
            if (!e.target.value.trim()) {
                this.showSearchSuggestions('');
            }
        });
        
        // 文件上传
        this.setupFileUpload();
        
        // 模态框相关
        this.setupModalEvents();
        
        // 导入导出
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('importData').addEventListener('click', () => {
            this.importData();
        });
        
        // 图片预览相关事件
        this.setupImagePreview();
        
        // 文档预览相关事件
        this.setupDocumentPreview();
        
        // 文档分类功能
        this.setupDocumentFilters();
        
        // 图片批量操作功能
        this.setupImageBulkOperations();
        
        // 链接批量操作功能
        this.setupLinkBulkOperations();
        
        // 新增：图片筛选功能
        this.setupImageFilters();
        
        // 新增：分类管理功能
        this.setupCategoryManagement();
        
        // 新增：图片详情功能
        this.setupImageDetailModal();
        
        // 新增：链接智能标签推荐
        this.setupLinkSmartTags();
        
        // 新增：链接筛选功能
        this.setupLinkFilters();
        
        // 新增：文件夹管理功能
        this.setupFolderManagement();
        
        // 新增：搜索筛选器功能
        this.setupSearchFilters();
    }
    
    // 新增：图片压缩功能
    compressImage(file, maxWidth = this.maxCompressedWidth, maxHeight = this.maxCompressedHeight, quality = this.imageCompressionQuality) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // 计算缩放比例
                let { width, height } = img;
                const ratio = Math.min(maxWidth / width, maxHeight / height);
                
                // 如果图片小于最大尺寸，不需要压缩
                if (ratio >= 1) {
                    resolve(img.src);
                    return;
                }
                
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
                
                canvas.width = width;
                canvas.height = height;
                
                // 绘制压缩后的图片
                ctx.drawImage(img, 0, 0, width, height);
                
                // 输出压缩后的图片
                const compressedDataUrl = canvas.toDataURL(file.type, quality);
                resolve(compressedDataUrl);
            };
            
            // 读取原图
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
    
    // 新增：获取图片元数据
    getImageMetadata(file) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    aspectRatio: img.naturalWidth / img.naturalHeight
                });
            };
            
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
    
    // 新增：智能标签推荐
    suggestImageTags(filename, existingTags = []) {
        const name = filename.toLowerCase();
        const suggestions = [];
        
        // 根据文件名推荐标签
        const tagMappings = {
            // 动漫相关
            '动漫': ['动漫', '二次元'],
            'anime': ['动漫', '二次元'],
            '角色': ['角色', '人物'],
            'character': ['角色', '人物'],
            // 风景相关
            '风景': ['风景', '自然'],
            'landscape': ['风景', '自然'],
            '山': ['山脉', '风景'],
            'mountain': ['山脉', '风景'],
            '海': ['海洋', '风景'],
            'sea': ['海洋', '风景'],
            // 设计相关
            '设计': ['设计', '素材'],
            'design': ['设计', '素材'],
            'ui': ['UI', '界面设计'],
            'logo': ['标志', '设计'],
            // 截图相关
            '截图': ['截图', '屏幕'],
            'screenshot': ['截图', '屏幕'],
            'screen': ['截图', '屏幕'],
            // 生活相关
            '生活': ['生活', '日常'],
            'life': ['生活', '日常'],
            '家庭': ['家庭', '生活'],
            'family': ['家庭', '生活']
        };
        
        Object.keys(tagMappings).forEach(keyword => {
            if (name.includes(keyword)) {
                tagMappings[keyword].forEach(tag => {
                    if (!suggestions.includes(tag) && !existingTags.includes(tag)) {
                        suggestions.push(tag);
                    }
                });
            }
        });
        
        return suggestions;
    }
    
    // 新增：获取或创建标签
    getOrCreateTag(tagName) {
        let tag = this.data.imageTags.find(t => t.name === tagName);
        if (!tag) {
            tag = {
                id: this.generateId(),
                name: tagName,
                count: 0,
                color: this.generateTagColor(),
                createdAt: new Date().toISOString()
            };
            this.data.imageTags.push(tag);
        }
        return tag;
    }
    
    // 新增：生成标签颜色
    generateTagColor() {
        const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6b7280'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 新增：设置图片筛选功能
    setupImageFilters() {
        const categoryFilter = document.getElementById('imageCategoryFilter');
        const tagFilter = document.getElementById('imageTagFilter');
        const sortFilter = document.getElementById('imageSortFilter');
        const clearFiltersBtn = document.getElementById('clearImageFilters');
        
        if (!categoryFilter || !tagFilter || !sortFilter) return;
        
        // 筛选器事件监听
        [categoryFilter, tagFilter, sortFilter].forEach(filter => {
            filter.addEventListener('change', () => {
                this.applyImageFilters();
            });
        });
        
        // 清除筛选按钮
        clearFiltersBtn?.addEventListener('click', () => {
            this.clearImageFilters();
        });
        
        // 初始化筛选器选项
        this.updateImageFilterOptions();
    }
    
    // 更新筛选器选项
    updateImageFilterOptions() {
        this.updateCategoryFilterOptions();
        this.updateTagFilterOptions();
    }
    
    // 更新分类筛选器选项
    updateCategoryFilterOptions() {
        const categoryFilter = document.getElementById('imageCategoryFilter');
        if (!categoryFilter) return;
        
        // 保存当前选中值
        const currentValue = categoryFilter.value;
        
        // 清空选项
        categoryFilter.innerHTML = '<option value="all">所有分类</option>';
        
        // 添加分类选项
        this.data.imageCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        
        // 恢复之前的选中值
        if (currentValue && [...categoryFilter.options].some(opt => opt.value === currentValue)) {
            categoryFilter.value = currentValue;
        }
    }
    
    // 更新标签筛选器选项
    updateTagFilterOptions() {
        const tagFilter = document.getElementById('imageTagFilter');
        if (!tagFilter) return;
        
        // 保存当前选中值
        const currentValue = tagFilter.value;
        
        // 清空选项
        tagFilter.innerHTML = '<option value="all">所有标签</option>';
        
        // 获取所有标签并按使用次数排序
        const sortedTags = [...this.data.imageTags]
            .filter(tag => tag.count > 0)
            .sort((a, b) => b.count - a.count);
        
        // 添加标签选项
        sortedTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag.name;
            option.textContent = `${tag.name} (${tag.count})`;
            tagFilter.appendChild(option);
        });
        
        // 恢复之前的选中值
        if (currentValue && [...tagFilter.options].some(opt => opt.value === currentValue)) {
            tagFilter.value = currentValue;
        }
    }
    
    // 应用图片筛选
    applyImageFilters() {
        const categoryFilter = document.getElementById('imageCategoryFilter');
        const tagFilter = document.getElementById('imageTagFilter');
        const sortFilter = document.getElementById('imageSortFilter');
        
        if (!categoryFilter || !tagFilter || !sortFilter) return;
        
        const selectedCategory = categoryFilter.value;
        const selectedTag = tagFilter.value;
        const sortType = sortFilter.value;
        
        // 筛选图片
        let filteredImages = [...this.data.images];
        
        // 按分类筛选
        if (selectedCategory !== 'all') {
            filteredImages = filteredImages.filter(image => 
                image.imageCategory === selectedCategory
            );
        }
        
        // 按标签筛选
        if (selectedTag !== 'all') {
            filteredImages = filteredImages.filter(image => 
                image.tags && image.tags.includes(selectedTag)
            );
        }
        
        // 排序
        this.sortImages(filteredImages, sortType);
        
        // 显示筛选结果
        this.displayFilteredImages(filteredImages);
        
        // 更新统计信息
        this.updateImageStats(filteredImages);
    }
    
    // 图片排序
    sortImages(images, sortType) {
        switch (sortType) {
            case 'newest':
                images.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                break;
            case 'oldest':
                images.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
                break;
            case 'name':
                images.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'size':
                images.sort((a, b) => b.size - a.size);
                break;
            case 'category':
                images.sort((a, b) => {
                    const categoryA = this.getCategoryById(a.imageCategory)?.name || '';
                    const categoryB = this.getCategoryById(b.imageCategory)?.name || '';
                    return categoryA.localeCompare(categoryB);
                });
                break;
        }
    }
    
    // 显示筛选后的图片
    displayFilteredImages(images) {
        const container = document.getElementById('imagesGrid');
        container.innerHTML = '';
        
        if (images.length === 0) {
            container.innerHTML = this.getEmptyState('fas fa-filter', '未找到符合条件的图片', '请尝试调整筛选条件');
            return;
        }
        
        images.forEach((image, index) => {
            const card = this.createImageCard(image, index);
            container.appendChild(card);
        });
        
        // 设置批量模式状态
        if (this.bulkMode) {
            container.classList.add('bulk-mode');
        } else {
            container.classList.remove('bulk-mode');
        }
    }
    
    // 更新图片统计信息
    updateImageStats(images = null) {
        const displayImages = images || this.data.images;
        const container = document.getElementById('imageStats');
        
        if (!container) return;
        
        // 按分类统计
        const categoryStats = new Map();
        displayImages.forEach(image => {
            const categoryId = image.imageCategory || 'general';
            const category = this.getCategoryById(categoryId);
            if (category) {
                const count = categoryStats.get(categoryId) || 0;
                categoryStats.set(categoryId, count + 1);
            }
        });
        
        // 清空容器
        container.innerHTML = '';
        
        // 生成统计卡片
        categoryStats.forEach((count, categoryId) => {
            const category = this.getCategoryById(categoryId);
            if (category) {
                const card = document.createElement('div');
                card.className = 'image-stat-card';
                card.addEventListener('click', () => {
                    this.filterByCategory(categoryId);
                });
                
                card.innerHTML = `
                    <div class="image-stat-icon" style="background: ${category.color};">
                        <i class="${category.icon}"></i>
                    </div>
                    <div class="image-stat-info">
                        <h3>${count}</h3>
                        <p>${category.name}</p>
                    </div>
                `;
                
                container.appendChild(card);
            }
        });
    }
    
    // 按分类筛选
    filterByCategory(categoryId) {
        const categoryFilter = document.getElementById('imageCategoryFilter');
        if (categoryFilter) {
            categoryFilter.value = categoryId;
            this.applyImageFilters();
        }
    }
    
    // 获取分类信息
    getCategoryById(categoryId) {
        return this.data.imageCategories.find(cat => cat.id === categoryId);
    }
    
    // 清除图片筛选
    clearImageFilters() {
        const categoryFilter = document.getElementById('imageCategoryFilter');
        const tagFilter = document.getElementById('imageTagFilter');
        const sortFilter = document.getElementById('imageSortFilter');
        
        if (categoryFilter) categoryFilter.value = 'all';
        if (tagFilter) tagFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'newest';
    }
    
    // 新增：设置分类管理功能
    setupCategoryManagement() {
        const manageCategoriesBtn = document.getElementById('manageCategories');
        const modal = document.getElementById('categoryManageModal');
        const closeBtn = document.getElementById('closeCategoryManageModal');
        const cancelBtn = document.getElementById('cancelCategoryManage');
        const addBtn = document.getElementById('addNewCategory');
        
        if (!manageCategoriesBtn || !modal) return;
        
        // 打开分类管理模态框
        manageCategoriesBtn.addEventListener('click', () => {
            this.showCategoryManageModal();
        });
        
        // 关闭模态框
        [closeBtn, cancelBtn].forEach(btn => {
            btn?.addEventListener('click', () => {
                this.closeCategoryManageModal();
            });
        });
        
        // 添加新分类
        addBtn?.addEventListener('click', () => {
            this.addNewCategory();
        });
        
        // 设置颜色选择器
        this.setupColorPicker();
        
        // 设置图标选择器
        this.setupIconPicker();
    }
    
    // 显示分类管理模态框
    showCategoryManageModal() {
        const modal = document.getElementById('categoryManageModal');
        if (!modal) return;
        
        this.updateCategoryList();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭分类管理模态框
    closeCategoryManageModal() {
        const modal = document.getElementById('categoryManageModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.resetCategoryForm();
    }
    
    // 更新分类列表
    updateCategoryList() {
        const container = document.getElementById('categoryList');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.data.imageCategories.forEach(category => {
            const item = document.createElement('div');
            item.className = 'category-item';
            
            // 计算该分类的图片数量
            const imageCount = this.data.images.filter(img => img.imageCategory === category.id).length;
            
            item.innerHTML = `
                <div class="category-icon" style="background: ${category.color};">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-info">
                    <h4>${category.name}</h4>
                    <p>${category.description} • ${imageCount} 张图片</p>
                </div>
                <div class="category-actions">
                    ${category.id !== 'general' ? `
                        <button class="edit-category-btn" onclick="window.knowledgeBase.editCategory('${category.id}')" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-category-btn" onclick="window.knowledgeBase.deleteCategory('${category.id}')" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            `;
            
            container.appendChild(item);
        });
    }
    
    // 设置颜色选择器
    setupColorPicker() {
        const colorInput = document.getElementById('newCategoryColor');
        const presets = document.querySelectorAll('.color-preset');
        
        if (!colorInput) return;
        
        presets.forEach(preset => {
            preset.addEventListener('click', () => {
                const color = preset.dataset.color;
                colorInput.value = color;
                
                // 更新选中状态
                presets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
            });
        });
    }
    
    // 设置图标选择器
    setupIconPicker() {
        const iconInput = document.getElementById('newCategoryIcon');
        const presets = document.querySelectorAll('.icon-preset');
        
        if (!iconInput) return;
        
        presets.forEach(preset => {
            preset.addEventListener('click', () => {
                const icon = preset.dataset.icon;
                iconInput.value = icon;
                
                // 更新选中状态
                presets.forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
            });
        });
    }
    
    // 添加新分类
    addNewCategory() {
        const nameInput = document.getElementById('newCategoryName');
        const descInput = document.getElementById('newCategoryDescription');
        const colorInput = document.getElementById('newCategoryColor');
        const iconInput = document.getElementById('newCategoryIcon');
        
        if (!nameInput || !descInput || !colorInput || !iconInput) return;
        
        const name = nameInput.value.trim();
        const description = descInput.value.trim();
        const color = colorInput.value;
        const icon = iconInput.value.trim();
        
        // 验证输入
        if (!name) {
            this.showToast('错误', '请输入分类名称', 'error');
            return;
        }
        
        if (!description) {
            this.showToast('错误', '请输入分类描述', 'error');
            return;
        }
        
        // 检查名称是否已存在
        const existingCategory = this.data.imageCategories.find(cat => cat.name === name);
        if (existingCategory) {
            this.showToast('错误', '分类名称已存在', 'error');
            return;
        }
        
        // 创建新分类
        const newCategory = {
            id: this.generateId(),
            name: name,
            description: description,
            color: color,
            icon: icon || 'fas fa-folder'
        };
        
        this.data.imageCategories.push(newCategory);
        this.saveData();
        
        // 更新UI
        this.updateCategoryList();
        this.updateImageFilterOptions();
        this.resetCategoryForm();
        
        this.showToast('成功', `已添加分类"${name}"`, 'success');
    }
    
    // 编辑分类
    editCategory(categoryId) {
        const category = this.getCategoryById(categoryId);
        if (!category) return;
        
        // 填充表单
        const nameInput = document.getElementById('newCategoryName');
        const descInput = document.getElementById('newCategoryDescription');
        const colorInput = document.getElementById('newCategoryColor');
        const iconInput = document.getElementById('newCategoryIcon');
        
        if (nameInput) nameInput.value = category.name;
        if (descInput) descInput.value = category.description;
        if (colorInput) colorInput.value = category.color;
        if (iconInput) iconInput.value = category.icon;
        
        // 更新按钮文本
        const addBtn = document.getElementById('addNewCategory');
        if (addBtn) {
            addBtn.innerHTML = '<i class="fas fa-save"></i> 保存修改';
            addBtn.onclick = () => this.saveEditedCategory(categoryId);
        }
    }
    
    // 保存编辑的分类
    saveEditedCategory(categoryId) {
        const category = this.getCategoryById(categoryId);
        if (!category) return;
        
        const nameInput = document.getElementById('newCategoryName');
        const descInput = document.getElementById('newCategoryDescription');
        const colorInput = document.getElementById('newCategoryColor');
        const iconInput = document.getElementById('newCategoryIcon');
        
        if (!nameInput || !descInput || !colorInput || !iconInput) return;
        
        const name = nameInput.value.trim();
        const description = descInput.value.trim();
        const color = colorInput.value;
        const icon = iconInput.value.trim();
        
        // 验证输入
        if (!name || !description) {
            this.showToast('错误', '请填写完整信息', 'error');
            return;
        }
        
        // 检查名称是否与其他分类冲突
        const existingCategory = this.data.imageCategories.find(cat => cat.name === name && cat.id !== categoryId);
        if (existingCategory) {
            this.showToast('错误', '分类名称已存在', 'error');
            return;
        }
        
        // 更新分类
        category.name = name;
        category.description = description;
        category.color = color;
        category.icon = icon || 'fas fa-folder';
        
        this.saveData();
        
        // 更新UI
        this.updateCategoryList();
        this.updateImageFilterOptions();
        this.resetCategoryForm();
        
        this.showToast('成功', `已更新分类"${name}"`, 'success');
    }
    
    // 删除分类
    deleteCategory(categoryId) {
        const category = this.getCategoryById(categoryId);
        if (!category) return;
        
        // 检查是否有图片使用该分类
        const imagesInCategory = this.data.images.filter(img => img.imageCategory === categoryId);
        
        if (imagesInCategory.length > 0) {
            const confirmed = confirm(`分类"${category.name}"中还有 ${imagesInCategory.length} 张图片，删除后这些图片将移动到"通用"分类。确定要删除吗？`);
            if (!confirmed) return;
            
            // 将图片移动到通用分类
            imagesInCategory.forEach(image => {
                image.imageCategory = 'general';
            });
        } else {
            const confirmed = confirm(`确定要删除分类"${category.name}"吗？`);
            if (!confirmed) return;
        }
        
        // 删除分类
        this.data.imageCategories = this.data.imageCategories.filter(cat => cat.id !== categoryId);
        this.saveData();
        
        // 更新UI
        this.updateCategoryList();
        this.updateImageFilterOptions();
        this.showImages();
        
        this.showToast('成功', `已删除分类"${category.name}"`, 'success');
    }
    
    // 重置分类表单
    resetCategoryForm() {
        const nameInput = document.getElementById('newCategoryName');
        const descInput = document.getElementById('newCategoryDescription');
        const colorInput = document.getElementById('newCategoryColor');
        const iconInput = document.getElementById('newCategoryIcon');
        const addBtn = document.getElementById('addNewCategory');
        
        if (nameInput) nameInput.value = '';
        if (descInput) descInput.value = '';
        if (colorInput) colorInput.value = '#6366f1';
        if (iconInput) iconInput.value = 'fas fa-folder';
        
        // 重置按钮
        if (addBtn) {
            addBtn.innerHTML = '<i class="fas fa-plus"></i> 添加分类';
            addBtn.onclick = () => this.addNewCategory();
        }
        
        // 重置选中状态
        document.querySelectorAll('.color-preset').forEach(p => p.classList.remove('active'));
    }
    
    // 新增：设置图片详情模态框
    setupImageDetailModal() {
        const modal = document.getElementById('imageDetailModal');
        const closeBtn = document.getElementById('closeImageDetailModal');
        const cancelBtn = document.getElementById('cancelImageDetail');
        const saveBtn = document.getElementById('saveImageDetail');
        const compressedBtn = document.getElementById('showCompressed');
        const originalBtn = document.getElementById('showOriginal');
        const addNoteBtn = document.getElementById('addNoteAssociation');
        
        if (!modal) return;
        
        // 关闭模态框
        [closeBtn, cancelBtn].forEach(btn => {
            btn?.addEventListener('click', () => {
                this.closeImageDetailModal();
            });
        });
        
        // 保存按钮
        saveBtn?.addEventListener('click', () => {
            this.saveImageDetails();
        });
        
        // 图片质量切换
        compressedBtn?.addEventListener('click', () => {
            this.switchImageQuality('compressed');
        });
        
        originalBtn?.addEventListener('click', () => {
            this.switchImageQuality('original');
        });
        
        // 添加笔记关联
        addNoteBtn?.addEventListener('click', () => {
            this.showNoteAssociationDialog();
        });
        
        // 标签输入智能推荐
        this.setupDetailTagSuggestions();
    }
    
    // 显示图片详情模态框
    showImageDetailModal(imageId) {
        const image = this.data.images.find(img => img.id === imageId);
        if (!image) return;
        
        this.currentEditingImage = image;
        
        // 填充表单数据
        this.populateImageDetailForm(image);
        
        // 显示模态框
        const modal = document.getElementById('imageDetailModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 填充图片详情表单
    populateImageDetailForm(image) {
        // 基本信息
        const nameInput = document.getElementById('detailImageName');
        const categorySelect = document.getElementById('detailImageCategory');
        const descriptionInput = document.getElementById('detailImageDescription');
        const tagsInput = document.getElementById('detailImageTags');
        
        if (nameInput) nameInput.value = image.name || '';
        if (descriptionInput) descriptionInput.value = image.description || '';
        if (tagsInput) tagsInput.value = (image.tags || []).join(', ');
        
        // 更新分类选项
        this.updateDetailCategoryOptions();
        if (categorySelect) categorySelect.value = image.imageCategory || 'general';
        
        // 显示图片
        this.displayDetailImage(image, 'compressed');
        
        // 显示元数据
        this.displayImageMetadata(image);
        
        // 显示关联笔记
        this.displayAssociatedNotes(image);
        
        // 显示智能推荐标签
        this.displaySuggestedTags(image);
    }
    
    // 更新详情对话框的分类选项
    updateDetailCategoryOptions() {
        const categorySelect = document.getElementById('detailImageCategory');
        if (!categorySelect) return;
        
        categorySelect.innerHTML = '';
        
        this.data.imageCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }
    
    // 显示详情图片
    displayDetailImage(image, quality = 'compressed') {
        const imageElement = document.getElementById('detailImage');
        const compressedBtn = document.getElementById('showCompressed');
        const originalBtn = document.getElementById('showOriginal');
        
        if (!imageElement) return;
        
        // 选择显示的图片
        const dataUrl = quality === 'original' && image.originalDataUrl ? 
            image.originalDataUrl : image.dataUrl;
        
        imageElement.src = dataUrl;
        imageElement.alt = image.name;
        
        // 更新按钮状态
        if (compressedBtn && originalBtn) {
            compressedBtn.classList.toggle('active', quality === 'compressed');
            originalBtn.classList.toggle('active', quality === 'original');
            
            // 如果没有原图，禁用原图按钮
            originalBtn.disabled = !image.originalDataUrl || !image.compressed;
        }
    }
    
    // 显示图片元数据
    displayImageMetadata(image) {
        const dimensionsEl = document.getElementById('imageDimensions');
        const fileSizeEl = document.getElementById('imageFileSize');
        const formatEl = document.getElementById('imageFormat');
        
        if (dimensionsEl && image.metadata) {
            dimensionsEl.textContent = `${image.metadata.width} × ${image.metadata.height}`;
        }
        
        if (fileSizeEl) {
            fileSizeEl.textContent = this.formatFileSize(image.size);
        }
        
        if (formatEl) {
            formatEl.textContent = image.type || '未知';
        }
    }
    
    // 显示关联笔记
    displayAssociatedNotes(image) {
        const container = document.getElementById('associatedNotesList');
        if (!container) return;
        
        container.innerHTML = '';
        
        // 使用新的关联数据结构
        const associations = this.data.imageNoteAssociations.filter(assoc => assoc.imageId === image.id);
        
        associations.forEach(assoc => {
            const note = this.data.notes.find(n => n.id === assoc.noteId);
            if (note) {
                const item = document.createElement('div');
                item.className = 'note-association-item';
                
                // 获取笔记内容的纯文本版本
                const textContent = this.getPlainTextFromHTML(note.content).substring(0, 100);
                
                item.innerHTML = `
                    <div class="note-info">
                        <h5>${this.escapeHtml(note.title)}</h5>
                        <p>${this.escapeHtml(textContent)}${textContent.length >= 100 ? '...' : ''}</p>
                    </div>
                    <button class="remove-association" onclick="window.knowledgeBase.removeImageNoteAssociation('${assoc.id}')" title="取消关联">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                container.appendChild(item);
            }
        });
        
        if (associations.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); font-size: 0.875rem; padding: var(--spacing-md);">暂无关联笔记</p>';
        }
    }
    
    // 显示智能推荐标签
    displaySuggestedTags(image) {
        const container = document.getElementById('detailSuggestedTags');
        if (!container) return;
        
        const existingTags = image.tags || [];
        const suggestions = this.suggestImageTags(image.name, existingTags);
        
        if (suggestions.length === 0) {
            container.innerHTML = '';
            return;
        }
        
        container.innerHTML = `
            <h6>智能推荐</h6>
            <div class="tag-suggestions-list">
                ${suggestions.map(tag => 
                    `<span class="suggested-tag" onclick="window.knowledgeBase.addSuggestedTag('${tag}')">${tag}</span>`
                ).join('')}
            </div>
        `;
    }
    
    // 添加推荐标签
    addSuggestedTag(tagName) {
        const tagsInput = document.getElementById('detailImageTags');
        if (!tagsInput) return;
        
        const currentTags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        if (!currentTags.includes(tagName)) {
            currentTags.push(tagName);
            tagsInput.value = currentTags.join(', ');
        }
    }
    
    // 切换图片质量
    switchImageQuality(quality) {
        if (!this.currentEditingImage) return;
        this.displayDetailImage(this.currentEditingImage, quality);
    }
    
    // 保存图片详情
    saveImageDetails() {
        if (!this.currentEditingImage) return;
        
        const nameInput = document.getElementById('detailImageName');
        const categorySelect = document.getElementById('detailImageCategory');
        const descriptionInput = document.getElementById('detailImageDescription');
        const tagsInput = document.getElementById('detailImageTags');
        
        if (!nameInput || !categorySelect || !descriptionInput || !tagsInput) return;
        
        const name = nameInput.value.trim();
        const category = categorySelect.value;
        const description = descriptionInput.value.trim();
        const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        // 验证输入
        if (!name) {
            this.showToast('错误', '请输入图片名称', 'error');
            return;
        }
        
        // 更新图片信息
        this.currentEditingImage.name = name;
        this.currentEditingImage.imageCategory = category;
        this.currentEditingImage.description = description;
        this.currentEditingImage.tags = tags;
        
        // 更新标签数据
        tags.forEach(tagName => {
            this.getOrCreateTag(tagName);
        });
        this.updateTagUsage();
        
        // 保存数据
        this.saveData();
        
        // 更新UI
        this.updateImageFilterOptions();
        this.showImages();
        this.closeImageDetailModal();
        
        this.showToast('成功', '图片信息已更新', 'success');
    }
    
    // 关闭图片详情模态框
    closeImageDetailModal() {
        const modal = document.getElementById('imageDetailModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentEditingImage = null;
    }
    
    // 设置详情模态框的标签智能推荐
    setupDetailTagSuggestions() {
        const tagsInput = document.getElementById('detailImageTags');
        const suggestionsContainer = document.getElementById('detailTagSuggestions');
        
        if (!tagsInput || !suggestionsContainer) return;
        
        // 标签输入事件
        tagsInput.addEventListener('input', () => {
            this.showDetailTagSuggestions();
        });
        
        tagsInput.addEventListener('blur', () => {
            setTimeout(() => {
                suggestionsContainer.classList.remove('active');
            }, 200);
        });
    }
    
    // 显示详情模态框的标签建议
    showDetailTagSuggestions() {
        const tagsInput = document.getElementById('detailImageTags');
        const suggestionsContainer = document.getElementById('detailTagSuggestions');
        
        if (!tagsInput || !suggestionsContainer) return;
        
        const input = tagsInput.value;
        const lastCommaIndex = input.lastIndexOf(',');
        const currentTag = input.substring(lastCommaIndex + 1).trim().toLowerCase();
        
        if (currentTag.length < 1) {
            suggestionsContainer.classList.remove('active');
            return;
        }
        
        // 查找匹配的标签
        const matchingTags = this.data.imageTags
            .filter(tag => tag.name.toLowerCase().includes(currentTag))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
        
        if (matchingTags.length === 0) {
            suggestionsContainer.classList.remove('active');
            return;
        }
        
        // 显示建议
        suggestionsContainer.innerHTML = matchingTags.map(tag => 
            `<div class="tag-suggestion-item" onclick="window.knowledgeBase.selectDetailTagSuggestion('${tag.name}')">
                <span class="tag-name">${tag.name}</span>
                <span class="tag-count">${tag.count}</span>
            </div>`
        ).join('');
        
        suggestionsContainer.classList.add('active');
    }
    
    // 选择详情模态框的标签建议
    selectDetailTagSuggestion(tagName) {
        const tagsInput = document.getElementById('detailImageTags');
        const suggestionsContainer = document.getElementById('detailTagSuggestions');
        
        if (!tagsInput) return;
        
        const input = tagsInput.value;
        const lastCommaIndex = input.lastIndexOf(',');
        const beforeLastTag = input.substring(0, lastCommaIndex + 1);
        
        tagsInput.value = beforeLastTag + (beforeLastTag ? ' ' : '') + tagName + ', ';
        tagsInput.focus();
        
        if (suggestionsContainer) {
            suggestionsContainer.classList.remove('active');
        }
    }
    updateTagUsage() {
        // 重置所有标签计数
        this.data.imageTags.forEach(tag => tag.count = 0);
        
        // 统计每个标签的使用次数
        this.data.images.forEach(image => {
            if (image.tags) {
                image.tags.forEach(tagName => {
                    const tag = this.data.imageTags.find(t => t.name === tagName);
                    if (tag) {
                        tag.count++;
                    }
                });
            }
        });
        
        // 删除未使用的标签
        this.data.imageTags = this.data.imageTags.filter(tag => tag.count > 0);
    }
    isImageDragging(e) {
        // 检查拖拽数据是否包含图片排序的特殊标记
        if (e.dataTransfer.types.includes('application/x-image-reorder')) {
            return true;
        }
        
        // 检查是否有正在拖拽的图片
        if (this.draggedImage) {
            return true;
        }
        
        // 检查是否在图片网格内部拖拽且当前是图片页面
        const imageGrid = document.getElementById('imagesGrid');
        if (imageGrid && imageGrid.contains(e.target) && this.currentSection === 'images') {
            return true;
        }
        
        return false;
    }
    
    // 设置文件上传功能
    setupFileUpload() {
        // 全局拖拽事件 - 打开模态框
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        // 全局拖拽事件 - 检测文件拖拽并打开模态框
        let dragCounter = 0;
        
        document.addEventListener('dragenter', (e) => {
            // 检查是否是外部文件拖拽（不是图片内部拖拽排序）
            if (e.dataTransfer.types.includes('Files') && !this.isImageDragging(e)) {
                dragCounter++;
                this.showAddContentModal();
                // 自动切换到文件上传选项卡
                this.switchTab('file');
            }
        });
        
        document.addEventListener('dragleave', () => {
            dragCounter--;
        });
        
        // 初始化模态框文件上传功能
        this.setupModalFileUpload();
    }
    
    // 设置模态框文件上传功能
    setupModalFileUpload() {
        const modalDropArea = document.getElementById('modalDropArea');
        const modalDragOverlay = document.getElementById('modalDragOverlay');
        const modalFileInput = document.getElementById('modalFileInput');
        const modalSelectFiles = document.getElementById('modalSelectFiles');
        const modalClearFiles = document.getElementById('modalClearFiles');
        
        // 待上传文件列表
        this.modalPendingFiles = [];
        
        // 模态框内拖拽事件
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            modalDropArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        modalDropArea.addEventListener('dragenter', (e) => {
            if (e.dataTransfer.types.includes('Files')) {
                modalDropArea.classList.add('drag-over');
                modalDragOverlay.classList.add('active');
            }
        });
        
        modalDropArea.addEventListener('dragleave', (e) => {
            if (!modalDropArea.contains(e.relatedTarget)) {
                modalDropArea.classList.remove('drag-over');
                modalDragOverlay.classList.remove('active');
            }
        });
        
        modalDropArea.addEventListener('drop', (e) => {
            modalDropArea.classList.remove('drag-over');
            modalDragOverlay.classList.remove('active');
            
            const files = Array.from(e.dataTransfer.files);
            if (files.length > 0) {
                this.handleModalFileSelection(files);
            }
        });
        
        // 点击选择文件
        modalSelectFiles.addEventListener('click', () => {
            modalFileInput.click();
        });
        
        modalFileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length > 0) {
                this.handleModalFileSelection(files);
            }
            e.target.value = '';
        });
        
        // 清空文件列表
        modalClearFiles.addEventListener('click', () => {
            this.clearModalPendingFiles();
        });
    }
    
    // 处理模态框文件选择
    handleModalFileSelection(files) {
        const validFiles = [];
        const invalidFiles = [];
        
        files.forEach(file => {
            try {
                // 使用安全验证
                const secureFile = this.secureFileUpload(file);
                validFiles.push(secureFile);
            } catch (error) {
                invalidFiles.push({
                    file: file,
                    error: error.message
                });
            }
        });
        
        // 显示错误信息
        if (invalidFiles.length > 0) {
            const errorMessages = invalidFiles.map(item => 
                `${item.file.name}: ${item.error}`
            ).join('\n');
            this.showToast('文件验证失败', errorMessages, 'error');
        }
        
        // 添加有效文件到待上传列表
        validFiles.forEach(secureFile => {
            this.addModalPendingFile(secureFile.originalFile);
        });
        
        this.updateModalFilePreview();
    }
    
    // 添加文件到模态框待上传列表
    addModalPendingFile(file) {
        // 检查文件是否已存在
        const exists = this.modalPendingFiles.some(f => 
            f.name === file.name && f.size === file.size
        );
        
        if (exists) {
            this.showToast('警告', `文件 "${this.escapeHtml(file.name)}" 已在列表中`, 'warning');
            return;
        }
        
        const fileItem = {
            id: this.generateId(),
            file: file,
            name: this.sanitizeInput(file.name),
            size: file.size,
            type: file.type,
            status: 'pending',
            error: null,
            thumbnail: null
        };
        
        this.modalPendingFiles.push(fileItem);
        
        // 生成缩略图
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                fileItem.thumbnail = e.target.result;
                this.updateModalFilePreviewList();
            };
            reader.readAsDataURL(file);
        }
        
        this.updateModalFilePreviewList();
    }
    
    // 处理图片文件
    processImageFile(file, item, fileItem) {
        const reader = new FileReader();
        reader.onload = (e) => {
            item.dataUrl = e.target.result;
            item.category = 'images';
            this.data.images.push(item);
            fileItem.status = 'success';
            this.updateFilePreviewItem(fileItem);
            this.saveAndRefresh();
        };
        reader.onerror = () => {
            fileItem.status = 'error';
            fileItem.error = '文件读取失败';
            this.updateFilePreviewItem(fileItem);
        };
        reader.readAsDataURL(file);
    }
    
    // 处理视频文件
    processVideoFile(file, item, fileItem) {
        const reader = new FileReader();
        reader.onload = (e) => {
            item.dataUrl = e.target.result;
            item.category = 'videos';
            this.data.videos.push(item);
            fileItem.status = 'success';
            this.updateFilePreviewItem(fileItem);
            this.saveAndRefresh();
        };
        reader.onerror = () => {
            fileItem.status = 'error';
            fileItem.error = '文件读取失败';
            this.updateFilePreviewItem(fileItem);
        };
        reader.readAsDataURL(file);
    }
    
    // 处理文档文件
    processDocumentFile(file, item, fileItem) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (file.type === 'text/plain') {
                item.content = e.target.result;
            } else {
                item.dataUrl = e.target.result;
            }
            item.category = 'documents';
            this.data.documents.push(item);
            fileItem.status = 'success';
            this.updateFilePreviewItem(fileItem);
            this.saveAndRefresh();
        };
        reader.onerror = () => {
            fileItem.status = 'error';
            fileItem.error = '文件读取失败';
            this.updateFilePreviewItem(fileItem);
        };
        
        if (file.type === 'text/plain') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    }
    
    // 保存数据并刷新界面
    saveAndRefresh() {
        this.saveData();
        this.updateStats();
        this.updateLinksPageStats(); // 更新链接页面统计
        this.updateFolderLinkCounts(); // 更新文件夹链接数量
        this.renderEnhancedFolderTabs(); // 更新文件夹标签
        this.displayFilteredLinks(); // 更新链接显示
        this.showRecentItems();
        this.refreshCurrentSection();
    }
    
    // 显示通知消息
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10002;
            display: flex;
            align-items: center;
            gap: 8px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        // 设置背景色
        const colors = {
            'error': 'linear-gradient(135deg, #ef4444, #dc2626)',
            'warning': 'linear-gradient(135deg, #f59e0b, #d97706)',
            'info': 'linear-gradient(135deg, #3b82f6, #2563eb)',
            'success': 'linear-gradient(135deg, #10b981, #059669)'
        };
        notification.style.background = colors[type] || colors.info;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 设置图片预览功能
    setupImagePreview() {
        this.previewModal = document.getElementById('imagePreviewModal');
        const closeBtn = document.getElementById('closePreview');
        const prevBtn = document.getElementById('prevImage');
        const nextBtn = document.getElementById('nextImage');
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        const resetZoomBtn = document.getElementById('resetZoom');
        const downloadBtn = document.getElementById('downloadImage');
        const imageWrapper = document.querySelector('.image-wrapper');
        const previewImage = document.getElementById('previewImage');
        
        // 关闭预览
        closeBtn.addEventListener('click', () => {
            this.closeImagePreview();
        });
        
        // 点击遮罩层关闭
        this.previewModal.addEventListener('click', (e) => {
            if (e.target === this.previewModal) {
                this.closeImagePreview();
            }
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.previewModal.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeImagePreview();
                    break;
                case 'ArrowLeft':
                    this.showPreviousImage();
                    break;
                case 'ArrowRight':
                    this.showNextImage();
                    break;
                case '+':
                case '=':
                    this.zoomIn();
                    break;
                case '-':
                    this.zoomOut();
                    break;
                case '0':
                    this.resetZoom();
                    break;
            }
        });
        
        // 导航按钮
        prevBtn.addEventListener('click', () => {
            this.showPreviousImage();
        });
        
        nextBtn.addEventListener('click', () => {
            this.showNextImage();
        });
        
        // 缩放按钮
        zoomInBtn.addEventListener('click', () => {
            this.zoomIn();
        });
        
        zoomOutBtn.addEventListener('click', () => {
            this.zoomOut();
        });
        
        resetZoomBtn.addEventListener('click', () => {
            this.resetZoom();
        });
        
        // 下载按钮
        downloadBtn.addEventListener('click', () => {
            this.downloadCurrentImage();
        });
        
        // 鼠标滚轮缩放
        imageWrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });
        
        // 拖动功能
        let startX, startY, initialX, initialY;
        
        imageWrapper.addEventListener('mousedown', (e) => {
            if (this.currentZoom <= 1) return;
            
            this.isDragging = true;
            imageWrapper.classList.add('dragging');
            
            startX = e.clientX;
            startY = e.clientY;
            initialX = this.imagePosition.x;
            initialY = this.imagePosition.y;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            this.imagePosition.x = initialX + deltaX;
            this.imagePosition.y = initialY + deltaY;
            
            this.updateImagePosition();
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                imageWrapper.classList.remove('dragging');
            }
        });
        
        // 双击缩放
        previewImage.addEventListener('dblclick', () => {
            // 获取当前的智能初始缩放值
            const container = document.querySelector('.image-preview-container');
            const containerWidth = container.clientWidth - 160;
            const containerHeight = container.clientHeight - 80;
            const imageWidth = previewImage.naturalWidth;
            const imageHeight = previewImage.naturalHeight;
            const scaleX = containerWidth / imageWidth;
            const scaleY = containerHeight / imageHeight;
            const smartScale = Math.min(scaleX, scaleY, 1);
            
            if (Math.abs(this.currentZoom - smartScale) < 0.1) {
                // 如果当前是智能尺寸，切换到原图尺寸
                this.currentZoom = 1;
            } else {
                // 否则切换到智能尺寸
                this.currentZoom = smartScale;
            }
            
            this.imagePosition = { x: 0, y: 0 };
            this.updateImageTransform();
        });
    }
    
    // 打开图片预览
    openImagePreview(imageIndex, images = null) {
        this.currentImages = images || this.data.images;
        this.currentImageIndex = imageIndex;
        this.currentZoom = 1;
        this.imagePosition = { x: 0, y: 0 };
        
        if (this.currentImages.length === 0) return;
        
        const image = this.currentImages[this.currentImageIndex];
        
        // 更新图片信息
        document.getElementById('previewImageName').textContent = image.name;
        document.getElementById('previewImageMeta').textContent = 
            `${this.formatDate(image.uploadDate)} • ${this.formatFileSize(image.size)} • ${this.currentImageIndex + 1} / ${this.currentImages.length}`;
        
        // 更新图片
        const previewImage = document.getElementById('previewImage');
        previewImage.src = image.dataUrl;
        previewImage.alt = image.name;
        
        // 等待图片加载完成后检查是否需要初始缩放
        previewImage.onload = () => {
            this.checkAndAdjustInitialSize();
        };
        
        // 更新缩略图
        this.updateThumbnails();
        
        // 更新导航按钮状态
        this.updateNavigationButtons();
        
        // 显示模态框
        this.previewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭图片预览
    closeImagePreview() {
        this.previewModal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentZoom = 1;
        this.imagePosition = { x: 0, y: 0 };
        this.updateImageTransform();
    }
    
    // 显示上一张图片
    showPreviousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
            this.updatePreviewImage();
        }
    }
    
    // 显示下一张图片
    showNextImage() {
        if (this.currentImageIndex < this.currentImages.length - 1) {
            this.currentImageIndex++;
            this.updatePreviewImage();
        }
    }
    
    // 检查并调整初始尺寸
    checkAndAdjustInitialSize() {
        const previewImage = document.getElementById('previewImage');
        const container = document.querySelector('.image-preview-container');
        
        // 获取容器尺寸（减去内边距和导航按钮的空间）
        const containerWidth = container.clientWidth - 160; // 留出导航按钮空间
        const containerHeight = container.clientHeight - 80; // 留出上下内边距
        
        // 获取图片原始尺寸
        const imageWidth = previewImage.naturalWidth;
        const imageHeight = previewImage.naturalHeight;
        
        // 如果图片超出容器尺寸，计算缩放比例
        const scaleX = containerWidth / imageWidth;
        const scaleY = containerHeight / imageHeight;
        const autoScale = Math.min(scaleX, scaleY, 1); // 最大不超过1（原始尺寸）
        
        // 如果图片太大，自动缩放到合适大小
        if (autoScale < 1) {
            this.currentZoom = autoScale;
            console.log(`图片较大，自动缩放到 ${(autoScale * 100).toFixed(1)}%`);
        } else {
            this.currentZoom = 1;
            console.log('图片以原始尺寸显示');
        }
        
        // 重置位置
        this.imagePosition = { x: 0, y: 0 };
        
        // 更新显示
        this.updateImageTransform();
    }
    updatePreviewImage() {
        const image = this.currentImages[this.currentImageIndex];
        
        // 重置缩放和位置
        this.currentZoom = 1;
        this.imagePosition = { x: 0, y: 0 };
        
        // 更新图片
        const previewImage = document.getElementById('previewImage');
        previewImage.src = image.dataUrl;
        previewImage.alt = image.name;
        
        // 等待图片加载完成后检查是否需要初始缩放
        previewImage.onload = () => {
            this.checkAndAdjustInitialSize();
        };
        
        // 更新信息
        document.getElementById('previewImageName').textContent = image.name;
        document.getElementById('previewImageMeta').textContent = 
            `${this.formatDate(image.uploadDate)} • ${this.formatFileSize(image.size)} • ${this.currentImageIndex + 1} / ${this.currentImages.length}`;
        
        // 更新缩略图选中状态
        this.updateThumbnails();
        
        // 更新导航按钮
        this.updateNavigationButtons();
    }
    
    // 更新缩略图
    updateThumbnails() {
        const container = document.getElementById('imageThumbnails');
        container.innerHTML = '';
        
        this.currentImages.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === this.currentImageIndex ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${image.dataUrl}" alt="${image.name}">`;
            
            thumbnail.addEventListener('click', () => {
                this.currentImageIndex = index;
                this.updatePreviewImage();
            });
            
            container.appendChild(thumbnail);
        });
    }
    
    // 更新导航按钮状态
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevImage');
        const nextBtn = document.getElementById('nextImage');
        
        prevBtn.style.display = this.currentImageIndex > 0 ? 'flex' : 'none';
        nextBtn.style.display = this.currentImageIndex < this.currentImages.length - 1 ? 'flex' : 'none';
    }
    
    // 放大
    zoomIn() {
        if (this.currentZoom < 5) {
            this.currentZoom += 0.5;
            this.updateImageTransform();
        }
    }
    
    // 缩小
    zoomOut() {
        if (this.currentZoom > 0.5) {
            this.currentZoom -= 0.5;
            if (this.currentZoom <= 1) {
                this.imagePosition = { x: 0, y: 0 };
            }
            this.updateImageTransform();
        }
    }
    
    // 重置缩放
    resetZoom() {
        // 重新检查并设置合适的初始缩放
        this.imagePosition = { x: 0, y: 0 };
        this.checkAndAdjustInitialSize();
    }
    
    // 更新图片变换
    updateImageTransform() {
        const previewImage = document.getElementById('previewImage');
        const transform = `scale(${this.currentZoom}) translate(${this.imagePosition.x / this.currentZoom}px, ${this.imagePosition.y / this.currentZoom}px)`;
        previewImage.style.transform = transform;
    }
    
    // 更新图片位置
    updateImagePosition() {
        this.updateImageTransform();
    }
    
    // 下载当前图片
    downloadCurrentImage() {
        const image = this.currentImages[this.currentImageIndex];
        const link = document.createElement('a');
        link.href = image.dataUrl;
        link.download = image.name;
        link.click();
    }
    
    // 设置文档预览功能
    setupDocumentPreview() {
        this.documentPreviewModal = document.getElementById('documentPreviewModal');
        const closeBtn = document.getElementById('closeDocumentPreview');
        const downloadBtn = document.getElementById('downloadDocument');
        
        // 检查模态框是否存在
        if (!this.documentPreviewModal) {
            console.error('文档预览模态框未找到');
            return;
        }
        
        // 关闭预览
        closeBtn?.addEventListener('click', () => {
            this.closeDocumentPreview();
        });
        
        // 点击遮罩层关闭
        this.documentPreviewModal.addEventListener('click', (e) => {
            if (e.target === this.documentPreviewModal) {
                this.closeDocumentPreview();
            }
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.documentPreviewModal.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                this.closeDocumentPreview();
            }
        });
        
        // 下载按钮
        downloadBtn?.addEventListener('click', () => {
            this.downloadCurrentDocument();
        });
        
        console.log('文档预览功能初始化完成');
    }
    
    // 打开文档预览
    openDocumentPreview(doc) {
        console.log('打开文档预览:', doc);
        
        if (!this.documentPreviewModal) {
            console.error('文档预览模态框未初始化');
            return;
        }
        
        this.currentDocument = doc;
        
        // 更新文档信息
        const nameElement = document.getElementById('previewDocumentName');
        const metaElement = document.getElementById('previewDocumentMeta');
        
        if (nameElement) {
            nameElement.textContent = doc.name;
        }
        
        if (metaElement) {
            const docType = this.getDocumentType(doc.name, doc.type);
            metaElement.textContent = 
                `${docType.label} • ${this.formatDate(doc.uploadDate)} • ${this.formatFileSize(doc.size)}`;
        }
        
        // 更新文档内容
        this.loadDocumentContent(doc);
        
        // 显示模态框
        this.documentPreviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log('文档预览模态框已显示');
    }
    
    // 关闭文档预览
    closeDocumentPreview() {
        this.documentPreviewModal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentDocument = null;
    }
    
    // 加载文档内容
    loadDocumentContent(doc) {
        const container = document.getElementById('documentContent');
        if (!container) {
            console.error('文档内容容器未找到');
            return;
        }
        
        const docType = this.getDocumentType(doc.name, doc.type);
        console.log('加载文档内容:', docType, doc);
        
        if (docType.type === 'text' && doc.content) {
            // 文本文件直接显示内容
            container.innerHTML = `
                <h2>${doc.name}</h2>
                <pre style="white-space: pre-wrap; font-family: inherit; background: var(--bg-secondary); padding: var(--spacing-lg); border-radius: 8px; margin-top: var(--spacing-lg);">${doc.content}</pre>
            `;
            console.log('文本文件内容已加载');
        } else {
            // 其他文件类型显示占位符
            container.innerHTML = `
                <div class="document-placeholder">
                    <i class="${docType.icon}"></i>
                    <h3>${doc.name}</h3>
                    <p>此文件类型暂不支持在线预览，请下载查看。</p>
                    <p>文件类型：${docType.label} | 大小：${this.formatFileSize(doc.size)}</p>
                    <br>
                    <button class="btn-primary" onclick="window.knowledgeBase.downloadCurrentDocument()">
                        <i class="fas fa-download"></i> 下载文件
                    </button>
                </div>
            `;
            console.log('显示文件下载占位符');
        }
    }
    
    // 下载当前文档
    downloadCurrentDocument() {
        if (!this.currentDocument) return;
        
        const link = document.createElement('a');
        link.href = this.currentDocument.dataUrl || this.createTextFileUrl(this.currentDocument.content);
        link.download = this.currentDocument.name;
        link.click();
    }
    
    // 创建文本文件URL
    createTextFileUrl(content) {
        const blob = new Blob([content], { type: 'text/plain' });
        return URL.createObjectURL(blob);
    }
    setupModalEvents() {
        const modal = document.getElementById('addContentModal');
        const closeModal = document.getElementById('closeModal');
        const cancelAdd = document.getElementById('cancelAdd');
        const confirmAdd = document.getElementById('confirmAdd');
        
        closeModal.addEventListener('click', () => {
            this.closeModal();
        });
        
        cancelAdd.addEventListener('click', () => {
            this.closeModal();
        });
        
        confirmAdd.addEventListener('click', () => {
            this.handleModalSubmit();
        });
        
        // 选项卡切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                this.switchTab(type);
            });
        });
        
        // 链接表单提交
        document.getElementById('linkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addLink();
        });
        
        // 笔记表单提交
        document.getElementById('noteForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNote();
        });
        
        // 初始化富文本编辑器
        this.setupRichTextEditor();
        
        // 初始化标签智能联想
        this.setupTagSuggestions();
        
        // 编辑模态框事件
        const editModal = document.getElementById('editContentModal');
        const closeEditModal = document.getElementById('closeEditModal');
        const cancelEdit = document.getElementById('cancelEdit');
        const confirmEdit = document.getElementById('confirmEdit');
        
        if (closeEditModal) {
            closeEditModal.addEventListener('click', () => {
                this.closeEditModal();
            });
        }
        
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => {
                this.closeEditModal();
            });
        }
        
        if (confirmEdit) {
            confirmEdit.addEventListener('click', () => {
                this.saveEdit();
            });
        }
        
        // 删除确认模态框事件
        const deleteModal = document.getElementById('deleteConfirmModal');
        const closeDeleteModal = document.getElementById('closeDeleteModal');
        const cancelDelete = document.getElementById('cancelDelete');
        const confirmDelete = document.getElementById('confirmDelete');
        
        if (closeDeleteModal) {
            closeDeleteModal.addEventListener('click', () => {
                this.closeDeleteConfirmModal();
            });
        }
        
        if (cancelDelete) {
            cancelDelete.addEventListener('click', () => {
                this.closeDeleteConfirmModal();
            });
        }
        
        if (confirmDelete) {
            confirmDelete.addEventListener('click', () => {
                this.confirmDelete();
            });
        }
        
        // 为编辑模态框设置富文本编辑器
        this.setupEditRichTextEditor();
    }
    
    // 处理上传的文件

    // 添加链接
    async addLink() {
        this.hideError(); // 清除之前的错误提示
        
        try {
            // 验证表单数据
            const { url, title } = this.validateFormData('link');
            const description = document.getElementById('linkDescription').value;
            const tags = document.getElementById('linkTags').value;
            
            // 显示loading状态
            this.showButtonLoading('confirmAdd', '添加中...');
            
            // 模拟异步操作
            await this.simulateAsyncOperation(800);
            
            const item = {
                id: this.generateId(),
                url: url,
                title: title,
                description: description,
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                folderId: 'default', // 默认文件夹
                uploadDate: new Date().toISOString(),
                category: 'links'
            };
            
            this.data.links.push(item);
            // 更新标签统计用于智能推荐
            this.updateLinkTagStats(item.tags);
            this.saveData();
            this.updateStats();
            this.updateLinksPageStats(); // 更新链接页面统计
            this.showRecentItems();
            this.refreshCurrentSection();
            
            // 显示成功提示
            this.showToast('添加成功', '链接已成功添加到您的知识库', 'success');
            
            this.closeModal();
            
            // 清空表单
            document.getElementById('linkForm').reset();
            
        } catch (error) {
            this.showError('添加失败', error.message);
        } finally {
            this.hideButtonLoading('confirmAdd');
        }
    }
    
    // 添加笔记
    async addNote() {
        this.hideError(); // 清除之前的错误提示
        
        try {
            // 验证表单数据
            const { title, content } = this.validateFormData('note');
            const tags = document.getElementById('noteTags').value;
            
            // 显示loading状态
            this.showButtonLoading('confirmAdd', '创建中...');
            
            // 模拟异步操作（实际情况下可能是上传到服务器）
            await this.simulateAsyncOperation(1000);
            
            const item = {
                id: this.generateId(),
                title: title,
                content: content, // 保存HTML内容
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                uploadDate: new Date().toISOString(),
                category: 'notes'
            };
            
            this.data.notes.push(item);
            this.saveData();
            this.updateStats();
            this.showRecentItems();
            this.refreshCurrentSection();
            
            // 显示成功提示
            this.showToast('创建成功', '笔记已成功添加到您的知识库', 'success');
            
            this.closeModal();
            
            // 清空表单
            document.getElementById('noteForm').reset();
            this.clearRichTextEditor(); // 清空富文本编辑器
            
        } catch (error) {
            this.showError('创建失败', error.message);
        } finally {
            this.hideButtonLoading('confirmAdd');
        }
    }
    
    // 自动生成标签
    autoGenerateTags(file) {
        const tags = [];
        const extension = file.name.split('.').pop().toLowerCase();
        const docType = this.getDocumentType(file.name, file.type);
        
        // 根据文档类型生成标签
        switch (docType.type) {
            case 'pdf':
                tags.push('文档', 'PDF', '阅读');
                break;
            case 'word':
                tags.push('文档', 'Word', '编辑');
                break;
            case 'excel':
                tags.push('数据', 'Excel', '表格');
                break;
            case 'powerpoint':
                tags.push('演示', 'PPT', '幻灯片');
                break;
            case 'text':
                tags.push('文本', '笔记', '编辑');
                break;
            default:
                // 非文档类型保持原有逻辑
                const extensionMap = {
                    'jpg': ['图片', '照片'],
                    'jpeg': ['图片', '照片'],
                    'png': ['图片', '图像'],
                    'gif': ['图片', '动图'],
                    'mp4': ['视频', '媒体'],
                    'avi': ['视频', '媒体'],
                    'mov': ['视频', '媒体'],
                    'mp3': ['音频', '媒体'],
                    'wav': ['音频', '媒体']
                };
                
                if (extensionMap[extension]) {
                    tags.push(...extensionMap[extension]);
                }
                break;
        }
        
        return tags;
    }
    
    // 切换选项卡
    switchTab(type) {
        // 切换按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        // 切换内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${type}Tab`).classList.add('active');
        
        // 如果切换到笔记选项卡，自动聚焦标题输入框
        if (type === 'note') {
            setTimeout(() => {
                const titleInput = document.getElementById('noteTitle');
                if (titleInput) {
                    titleInput.focus();
                }
            }, 100); // 延迟一点确保元素已显示
        }
    }
    
    // 显示添加内容模态框
    showAddContentModal() {
        document.getElementById('addContentModal').classList.add('active');
    }
    
    // 关闭模态框
    closeModal() {
        document.getElementById('addContentModal').classList.remove('active');
        // 重置表单
        document.getElementById('linkForm').reset();
        document.getElementById('noteForm').reset();
        this.clearRichTextEditor(); // 清空富文本编辑器
        // 清空文件列表
        this.clearModalPendingFiles();
        // 重置选项卡
        this.switchTab('file');
    }
    
    // 处理模态框提交
    handleModalSubmit() {
        const activeTab = document.querySelector('.tab-content.active');
        const tabId = activeTab.id;
        
        if (tabId === 'fileTab') {
            this.processModalFileUpload();
        } else if (tabId === 'linkTab') {
            this.addLink();
        } else if (tabId === 'noteTab') {
            this.addNote();
        }
    }
    
    // 切换主题
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.setupTheme();
        localStorage.setItem('theme', this.theme);
    }
    
    // 设置主题
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('#themeToggle i');
        themeIcon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // 显示指定区域
    showSection(section) {
        // 更新导航状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // 显示对应内容区域
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');
        
        this.currentSection = section;
        
        // 清除之前的统计保障机制
        if (this.statsGuardTimer) {
            clearInterval(this.statsGuardTimer);
            this.statsGuardTimer = null;
        }
        
        // 对于链接页面，优先更新统计信息，避免被后续渲染覆盖
        if (section === 'links') {
            // 立即更新统计信息
            this.updateLinksPageStats();
            
            // 强制更新统计显示
            setTimeout(() => {
                this.forceUpdateLinksStats();
            }, 50);
            
            // 延迟执行其他初始化操作，确保统计信息先显示
            setTimeout(() => {
                this.refreshCurrentSection();
                // 再次更新统计信息确保不被覆盖
                this.forceUpdateLinksStats();
            }, 100);
            
        } else {
            // 其他页面正常处理
            this.refreshCurrentSection();
        }
    }
    
    // 刷新当前区域内容
    refreshCurrentSection() {
        switch (this.currentSection) {
            case 'dashboard':
                this.showRecentItems();
                break;
            case 'documents':
                this.showDocuments();
                break;
            case 'images':
                this.showImages();
                break;
            case 'videos':
                this.showVideos();
                break;
            case 'links':
                this.showLinks();
                break;
            case 'notes':
                this.showNotes();
                break;
            case 'search':
                this.showSearchResults();
                break;
        }
    }
    
    // 显示文档
    showDocuments() {
        // 首先初始化分类筛选器
        this.initDocumentFilters();
        
        // 显示文档列表
        this.displayFilteredDocuments();
    }
    
    // 设置文档分类功能
    setupDocumentFilters() {
        const docTypeFilter = document.getElementById('docTypeFilter');
        const docTagFilter = document.getElementById('docTagFilter');
        const docSortFilter = document.getElementById('docSortFilter');
        const clearFiltersBtn = document.getElementById('clearDocFilters');
        
        if (!docTypeFilter) return;
        
        // 筛选器变化事件
        [docTypeFilter, docTagFilter, docSortFilter].forEach(filter => {
            if (filter) {
                filter.addEventListener('change', () => {
                    this.displayFilteredDocuments();
                });
            }
        });
        
        // 清除筛选按钮
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearDocumentFilters();
            });
        }
    }
    
    // 初始化文档筛选器
    initDocumentFilters() {
        this.updateDocumentTagFilter();
        this.updateDocumentStats();
    }
    
    // 更新文档标签筛选器
    updateDocumentTagFilter() {
        const docTagFilter = document.getElementById('docTagFilter');
        if (!docTagFilter) return;
        
        // 获取所有文档标签
        const allTags = new Set();
        this.data.documents.forEach(doc => {
            if (doc.tags && Array.isArray(doc.tags)) {
                doc.tags.forEach(tag => allTags.add(tag));
            }
        });
        
        // 清空现有选项（保留第一个"所有标签"选项）
        while (docTagFilter.children.length > 1) {
            docTagFilter.removeChild(docTagFilter.lastChild);
        }
        
        // 添加标签选项
        Array.from(allTags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            docTagFilter.appendChild(option);
        });
    }
    
    // 显示筛选后的文档
    displayFilteredDocuments() {
        const container = document.getElementById('documentsGrid');
        if (!container) return;
        
        container.innerHTML = '';
        
        // 获取筛选条件
        const typeFilter = document.getElementById('docTypeFilter')?.value || 'all';
        const tagFilter = document.getElementById('docTagFilter')?.value || 'all';
        const sortFilter = document.getElementById('docSortFilter')?.value || 'newest';
        
        // 筛选文档
        let filteredDocs = this.data.documents.filter(doc => {
            // 类型筛选
            if (typeFilter !== 'all') {
                const docType = this.getDocumentType(doc.name, doc.type).type;
                if (docType !== typeFilter) return false;
            }
            
            // 标签筛选
            if (tagFilter !== 'all') {
                if (!doc.tags || !doc.tags.includes(tagFilter)) return false;
            }
            
            return true;
        });
        
        // 排序
        filteredDocs = this.sortDocuments(filteredDocs, sortFilter);
        
        // 显示结果
        if (filteredDocs.length === 0) {
            container.innerHTML = this.getEmptyState('fas fa-search', '未找到匹配的文档', '尝试调整筛选条件或添加新文档');
        } else {
            filteredDocs.forEach(doc => {
                const card = this.createContentCard(doc);
                container.appendChild(card);
            });
        }
        
        // 更新统计信息
        this.updateDocumentStats(filteredDocs.length);
    }
    
    // 文档排序
    sortDocuments(documents, sortType) {
        const sorted = [...documents];
        
        switch (sortType) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
            case 'name':
                return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            case 'size':
                return sorted.sort((a, b) => (b.size || 0) - (a.size || 0));
            case 'type':
                return sorted.sort((a, b) => {
                    const typeA = this.getDocumentType(a.name, a.type).type;
                    const typeB = this.getDocumentType(b.name, b.type).type;
                    return typeA.localeCompare(typeB);
                });
            default:
                return sorted;
        }
    }
    
    // 更新文档统计信息
    updateDocumentStats(filteredCount = null) {
        const statsContainer = document.getElementById('documentStats');
        if (!statsContainer) return;
        
        const totalCount = this.data.documents.length;
        const displayCount = filteredCount !== null ? filteredCount : totalCount;
        
        // 按类型统计
        const typeStats = {};
        this.data.documents.forEach(doc => {
            const type = this.getDocumentType(doc.name, doc.type).type;
            typeStats[type] = (typeStats[type] || 0) + 1;
        });
        
        // 计算总大小
        const totalSize = this.data.documents.reduce((sum, doc) => sum + (doc.size || 0), 0);
        
        statsContainer.innerHTML = `
            <div class="stats-summary">
                <div class="stat-item">
                    <i class="fas fa-file"></i>
                    <div class="stat-content">
                        <div class="stat-label">文档总数</div>
                        <div class="stat-value">${displayCount}${filteredCount !== null && filteredCount !== totalCount ? ` / ${totalCount}` : ''}</div>
                    </div>
                </div>
                <div class="stat-item">
                    <i class="fas fa-hdd"></i>
                    <div class="stat-content">
                        <div class="stat-label">占用空间</div>
                        <div class="stat-value">${this.formatFileSize(totalSize)}</div>
                    </div>
                </div>
            </div>
            <div class="type-stats">
                ${Object.entries(typeStats).map(([type, count]) => {
                    const typeInfo = this.getDocumentTypeInfo(type);
                    return `
                        <div class="type-stat-item" data-type="${type}">
                            <i class="${typeInfo.icon}"></i>
                            <div class="type-label">${typeInfo.label}</div>
                            <div class="type-count">${count}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        // 添加类型筛选点击事件
        statsContainer.querySelectorAll('.type-stat-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const docTypeFilter = document.getElementById('docTypeFilter');
                if (docTypeFilter) {
                    docTypeFilter.value = type;
                    this.displayFilteredDocuments();
                    
                    // 加入视觉反馈
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.transform = '';
                    }, 150);
                }
            });
        });
    }
    
    // 获取文档类型信息
    getDocumentTypeInfo(type) {
        const typeMap = {
            'pdf': { label: 'PDF', icon: 'fas fa-file-pdf' },
            'word': { label: 'Word', icon: 'fas fa-file-word' },
            'excel': { label: 'Excel', icon: 'fas fa-file-excel' },
            'powerpoint': { label: 'PPT', icon: 'fas fa-file-powerpoint' },
            'text': { label: '文本', icon: 'fas fa-file-alt' },
            'other': { label: '其他', icon: 'fas fa-file' }
        };
        
        return typeMap[type] || typeMap['other'];
    }
    
    // 清除文档筛选器
    clearDocumentFilters() {
        const docTypeFilter = document.getElementById('docTypeFilter');
        const docTagFilter = document.getElementById('docTagFilter');
        const docSortFilter = document.getElementById('docSortFilter');
        
        if (docTypeFilter) docTypeFilter.value = 'all';
        if (docTagFilter) docTagFilter.value = 'all';
        if (docSortFilter) docSortFilter.value = 'newest';
        
        this.displayFilteredDocuments();
    }
    
    // 设置图片批量操作功能
    setupImageBulkOperations() {
        const toggleBtn = document.getElementById('toggleBulkMode');
        const selectAllBtn = document.getElementById('selectAllImages');
        const clearSelectionBtn = document.getElementById('clearSelection');
        const bulkDownloadBtn = document.getElementById('bulkDownload');
        const bulkMoveBtn = document.getElementById('bulkMove');
        const bulkDeleteBtn = document.getElementById('bulkDelete');
        
        if (!toggleBtn) return;
        
        // 切换批量模式
        toggleBtn.addEventListener('click', () => {
            this.toggleBulkMode();
        });
        
        // 全选
        selectAllBtn?.addEventListener('click', () => {
            this.selectAllImages();
        });
        
        // 清除选择
        clearSelectionBtn?.addEventListener('click', () => {
            this.clearImageSelection();
        });
        
        // 批量下载
        bulkDownloadBtn?.addEventListener('click', () => {
            this.bulkDownloadImages();
        });
        
        // 批量移动
        bulkMoveBtn?.addEventListener('click', () => {
            this.showBulkMoveModal();
        });
        
        // 批量删除
        bulkDeleteBtn?.addEventListener('click', () => {
            this.bulkDeleteImages();
        });
        
        // 批量移动模态框事件
        this.setupBulkMoveModal();
        
        // 加载排序
        this.loadSortOrder();
    }
    
    // 切换批量模式
    toggleBulkMode() {
        this.bulkMode = !this.bulkMode;
        
        const toggleBtn = document.getElementById('toggleBulkMode');
        const bulkActions = document.getElementById('bulkActions');
        const bulkInfo = document.getElementById('bulkSelectionInfo');
        
        if (this.bulkMode) {
            toggleBtn.classList.add('active');
            toggleBtn.innerHTML = '<i class="fas fa-times"></i> 退出批量';
            bulkActions.style.display = 'flex';
            bulkInfo.style.display = 'block';
        } else {
            toggleBtn.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fas fa-check-square"></i> 批量选择';
            bulkActions.style.display = 'none';
            bulkInfo.style.display = 'none';
            this.clearImageSelection();
        }
        
        // 重新显示图片以更新UI
        this.showImages();
    }
    
    // 切换图片选择状态
    toggleImageSelection(imageId) {
        console.log('切换图片选择:', imageId, '当前状态:', this.selectedImages.has(imageId));
        
        if (this.selectedImages.has(imageId)) {
            this.selectedImages.delete(imageId);
        } else {
            this.selectedImages.add(imageId);
        }
        
        console.log('更新后状态:', this.selectedImages.has(imageId), '选中数量:', this.selectedImages.size);
        
        this.updateBulkSelectionInfo();
        
        // 重新渲染整个图片列表以确保复选框状态正确显示
        this.showImages();
    }
    
    // 更新图片卡片选择状态
    updateImageCardSelection(imageId) {
        console.log('更新图片卡片选择状态:', imageId);
        
        const card = document.querySelector(`[data-image-id="${imageId}"]`);
        if (!card) {
            console.error('未找到卡片:', imageId);
            return;
        }
        
        const checkbox = card.querySelector('.image-selection-checkbox');
        if (!checkbox) {
            console.error('未找到复选框:', imageId);
            return;
        }
        
        const checkIcon = checkbox.querySelector('i');
        if (!checkIcon) {
            console.error('未找到勾选图标:', imageId);
            return;
        }
        
        const isSelected = this.selectedImages.has(imageId);
        console.log('当前选中状态:', isSelected);
        
        if (isSelected) {
            // 选中状态
            console.log('设置为选中状态');
            card.classList.add('selected');
            checkbox.classList.add('checked');
            
            // 更新复选框HTML内容以确保勾选图标正确显示
            checkbox.innerHTML = '<i class="fas fa-check" style="display: block; color: white; font-size: 0.875rem;"></i>';
        } else {
            // 未选中状态
            console.log('设置为未选中状态');
            card.classList.remove('selected');
            checkbox.classList.remove('checked');
            
            // 更新复选框HTML内容以隐藏勾选图标
            checkbox.innerHTML = '<i class="fas fa-check" style="display: none;"></i>';
        }
        
        // 验证样式是否生效
        console.log('卡片类名:', card.className);
        console.log('复选框类名:', checkbox.className);
    }
    
    // 全选图片
    selectAllImages() {
        this.data.images.forEach(image => {
            this.selectedImages.add(image.id);
        });
        
        this.updateBulkSelectionInfo();
        this.showImages(); // 重新显示以更新选择状态
    }
    
    // 清除选择
    clearImageSelection() {
        this.selectedImages.clear();
        this.updateBulkSelectionInfo();
        this.showImages();
    }
    
    // 更新批量选择信息
    updateBulkSelectionInfo() {
        const countElement = document.querySelector('.selected-count');
        
        if (countElement) {
            countElement.textContent = this.selectedImages.size;
        }
        
        // 获取各个按钮元素
        const selectAllBtn = document.getElementById('selectAllImages');
        const clearSelectionBtn = document.getElementById('clearSelection');
        const bulkDownloadBtn = document.getElementById('bulkDownload');
        const bulkMoveBtn = document.getElementById('bulkMove');
        const bulkDeleteBtn = document.getElementById('bulkDelete');
        
        // 检查是否有图片可以操作
        const hasImages = this.data.images && this.data.images.length > 0;
        const hasSelection = this.selectedImages.size > 0;
        
        // 全选按钮：当有图片时启用，无图片时禁用
        if (selectAllBtn) {
            selectAllBtn.disabled = !hasImages;
        }
        
        // 清除选择按钮：当有选择时启用，无选择时禁用
        if (clearSelectionBtn) {
            clearSelectionBtn.disabled = !hasSelection;
        }
        
        // 其他批量操作按钮：当有选择时启用，无选择时禁用
        if (bulkDownloadBtn) {
            bulkDownloadBtn.disabled = !hasSelection;
        }
        if (bulkMoveBtn) {
            bulkMoveBtn.disabled = !hasSelection;
        }
        if (bulkDeleteBtn) {
            bulkDeleteBtn.disabled = !hasSelection;
        }
    }
    
    // 获取排序后的图片
    getSortedImages() {
        return this.sortOrder
            .map(id => this.data.images.find(img => img.id === id))
            .filter(img => img); // 过滤掉不存在的图片
    }
    
    // 设置图片拖拽事件
    setupImageDragEvents(card, image) {
        // 拖拽开始
        card.addEventListener('dragstart', (e) => {
            if (this.bulkMode) {
                e.preventDefault();
                return;
            }
            
            this.draggedImage = image;
            this.draggedImageElement = card;
            card.classList.add('dragging');
            
            // 设置拖拽数据，标记为图片内部拖拽
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', card.outerHTML);
            e.dataTransfer.setData('application/x-image-reorder', image.id);
        });
        
        // 拖拽结束
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            this.draggedImage = null;
            this.draggedImageElement = null;
            
            // 清除所有drag-over状态
            document.querySelectorAll('.image-card').forEach(c => {
                c.classList.remove('drag-over');
            });
        });
        
        // 拖拽进入
        card.addEventListener('dragover', (e) => {
            if (this.bulkMode || !this.draggedImage || this.draggedImage.id === image.id) {
                return;
            }
            
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            card.classList.add('drag-over');
        });
        
        // 拖拽离开
        card.addEventListener('dragleave', () => {
            card.classList.remove('drag-over');
        });
        
        // 放置
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            
            if (this.bulkMode || !this.draggedImage || this.draggedImage.id === image.id) {
                return;
            }
            
            this.reorderImages(this.draggedImage.id, image.id);
        });
    }
    
    // 重新排序图片
    reorderImages(draggedId, targetId) {
        const draggedIndex = this.sortOrder.indexOf(draggedId);
        const targetIndex = this.sortOrder.indexOf(targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        // 移除拖拽的项目
        this.sortOrder.splice(draggedIndex, 1);
        
        // 插入到新位置
        const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
        this.sortOrder.splice(newTargetIndex, 0, draggedId);
        
        // 保存排序并重新显示
        this.saveSortOrder();
        this.showImages();
        
        // 显示成功提示
        this.showToast('成功', '图片顺序已调整', 'success');
    }
    
    // 保存排序
    saveSortOrder() {
        localStorage.setItem('imageSortOrder', JSON.stringify(this.sortOrder));
    }
    
    // 加载排序
    loadSortOrder() {
        const saved = localStorage.getItem('imageSortOrder');
        if (saved) {
            this.sortOrder = JSON.parse(saved);
        }
    }
    
    // 批量下载图片
    async bulkDownloadImages() {
        if (this.selectedImages.size === 0) return;
        
        const selectedImageIds = Array.from(this.selectedImages);
        const selectedImageData = selectedImageIds.map(id => 
            this.data.images.find(img => img.id === id)
        ).filter(img => img);
        
        if (selectedImageData.length === 1) {
            // 单张图片直接下载
            this.downloadImage(selectedImageData[0]);
        } else {
            // 多张图片打包下载
            await this.downloadMultipleImages(selectedImageData);
        }
        
        this.showToast('成功', `已开始下载 ${selectedImageData.length} 张图片`, 'success');
    }
    
    // 下载单张图片
    downloadImage(image) {
        const link = document.createElement('a');
        link.href = image.dataUrl;
        link.download = image.name;
        link.click();
    }
    
    // 下载多张图片（逐个下载）
    async downloadMultipleImages(images) {
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            await new Promise(resolve => {
                setTimeout(() => {
                    this.downloadImage(image);
                    resolve();
                }, i * 500); // 间隔500ms下载，避免浏览器阻止
            });
        }
    }
    
    // 显示批量移动模态框
    showBulkMoveModal() {
        if (this.selectedImages.size === 0) return;
        
        const modal = document.getElementById('bulkMoveModal');
        const countElement = document.getElementById('moveSelectionCount');
        
        if (countElement) {
            countElement.textContent = this.selectedImages.size;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // 设置批量移动模态框
    setupBulkMoveModal() {
        const modal = document.getElementById('bulkMoveModal');
        const closeBtn = document.getElementById('closeBulkMoveModal');
        const cancelBtn = document.getElementById('cancelBulkMove');
        const confirmBtn = document.getElementById('confirmBulkMove');
        const categorySelect = document.getElementById('targetCategory');
        
        if (!modal) return;
        
        // 关闭模态框
        [closeBtn, cancelBtn].forEach(btn => {
            btn?.addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                this.resetBulkMoveForm();
            });
        });
        
        // 监听分类选择
        categorySelect?.addEventListener('change', () => {
            confirmBtn.disabled = !categorySelect.value;
        });
        
        // 确认移动
        confirmBtn?.addEventListener('click', () => {
            this.executeBulkMove();
        });
    }
    
    // 执行批量移动
    async executeBulkMove() {
        const categorySelect = document.getElementById('targetCategory');
        const tagsInput = document.getElementById('moveAddTags');
        const confirmBtn = document.getElementById('confirmBulkMove');
        
        if (!categorySelect.value) return;
        
        try {
            this.showButtonLoading('confirmBulkMove', '移动中...');
            
            const selectedImageIds = Array.from(this.selectedImages);
            const newTags = tagsInput.value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag);
            
            // 更新选中的图片
            selectedImageIds.forEach(id => {
                const image = this.data.images.find(img => img.id === id);
                if (image) {
                    // 添加分类标签
                    if (!image.tags.includes(categorySelect.value)) {
                        image.tags.push(categorySelect.value);
                    }
                    
                    // 添加额外标签
                    newTags.forEach(tag => {
                        if (!image.tags.includes(tag)) {
                            image.tags.push(tag);
                        }
                    });
                }
            });
            
            // 保存数据
            this.saveData();
            
            // 关闭模态框
            document.getElementById('bulkMoveModal').classList.remove('active');
            document.body.style.overflow = '';
            
            // 清除选择并重新显示
            this.clearImageSelection();
            this.showImages();
            
            this.showToast('成功', `已移动 ${selectedImageIds.length} 张图片到分类：${categorySelect.options[categorySelect.selectedIndex].text}`, 'success');
            
        } catch (error) {
            this.showToast('错误', '移动失败，请重试', 'error');
        } finally {
            this.hideButtonLoading('confirmBulkMove');
            this.resetBulkMoveForm();
        }
    }
    
    // 重置批量移动表单
    resetBulkMoveForm() {
        const categorySelect = document.getElementById('targetCategory');
        const tagsInput = document.getElementById('moveAddTags');
        const confirmBtn = document.getElementById('confirmBulkMove');
        
        if (categorySelect) categorySelect.value = '';
        if (tagsInput) tagsInput.value = '';
        if (confirmBtn) confirmBtn.disabled = true;
    }
    
    // 批量删除图片
    bulkDeleteImages() {
        if (this.selectedImages.size === 0) return;
        
        const selectedCount = this.selectedImages.size;
        const confirmMessage = `确定要删除选中的 ${selectedCount} 张图片吗？此操作不可撤销。`;
        
        if (confirm(confirmMessage)) {
            const selectedImageIds = Array.from(this.selectedImages);
            
            // 从数据中移除
            this.data.images = this.data.images.filter(img => !selectedImageIds.includes(img.id));
            
            // 从排序中移除
            this.sortOrder = this.sortOrder.filter(id => !selectedImageIds.includes(id));
            
            // 保存数据
            this.saveData();
            this.saveSortOrder();
            
            // 清除选择并重新显示
            this.clearImageSelection();
            this.showImages();
            this.updateStats();
            
            this.showToast('成功', `已删除 ${selectedCount} 张图片`, 'success');
        }
    }
    
    // 显示图片
    showImages() {
        const container = document.getElementById('imagesGrid');
        container.innerHTML = '';
        
        if (this.data.images.length === 0) {
            container.innerHTML = this.getEmptyState('fas fa-image', '暂无图片', '开始上传您的第一张图片');
            return;
        }
        
        // 初始化排序顺序
        if (this.sortOrder.length === 0) {
            this.sortOrder = this.data.images.map(img => img.id);
        }
        
        // 按照排序显示图片
        const sortedImages = this.getSortedImages();
        sortedImages.forEach((image, index) => {
            const card = this.createImageCard(image, index);
            container.appendChild(card);
        });
        
        // 设置批量模式状态
        if (this.bulkMode) {
            container.classList.add('bulk-mode');
        } else {
            container.classList.remove('bulk-mode');
        }
        
        // 更新批量选择信息
        this.updateBulkSelectionInfo();
    }
    
    // 显示视频
    showVideos() {
        const container = document.getElementById('videosGrid');
        container.innerHTML = '';
        
        if (this.data.videos.length === 0) {
            container.innerHTML = this.getEmptyState('fas fa-video', '暂无视频', '开始上传您的第一个视频文件');
            return;
        }
        
        this.data.videos.forEach(video => {
            const card = this.createVideoCard(video);
            container.appendChild(card);
        });
    }
    
    // 显示链接
    showLinks() {
        // 立即更新统计信息
        this.updateLinksPageStats();
        
        // 确保有测试数据（如果数据为空）
        if (this.data.links.length === 0) {
            this.addDefaultLinksForTesting();
            this.addDefaultTestData();
        }
        
        // 强制更新统计信息
        setTimeout(() => {
            this.forceUpdateLinksStats();
        }, 100);
        
        // 初始化筛选器
        this.initLinkFilters();
        
        // 更新文件夹显示
        this.renderEnhancedFolderTabs();
        this.updateCurrentFolderDisplay();
        
        // 显示筛选后的链接列表
        this.displayFilteredLinks();
        
        // 设置增强搜索功能
        this.setupEnhancedSearch();
        
        // 设置添加链接按钮
        this.setupAddLinkButton();
        
        // 在所有渲染操作完成后，启动持续的统计更新保障机制
        this.startStatsUpdateGuard();
        
        // 在所有渲染操作完成后，再次强制更新统计信息
        setTimeout(() => {
            this.updateLinksPageStats();
            this.forceUpdateLinksStats();
        }, 100);
        
        // 第二次延迟更新，确保显示正确
        setTimeout(() => {
            this.updateLinksPageStats();
            this.forceUpdateLinksStats();
        }, 300);
        
        // 第三次延迟更新，最后保障
        setTimeout(() => {
            this.forceUpdateLinksStats();
        }, 500);
    }
    
    // 初始化链接筛选器
    initLinkFilters() {
        this.updateLinkFilterOptions();
    }
    
    // 更新链接页面统计信息 - 重新编写的更可靠版本
    updateLinksPageStats() {
        console.log('🔄 开始更新链接页面统计信息');
        
        // 确保数据和DOM都准备好的更新函数
        const updateStats = () => {
            try {
                // 1. 验证数据源
                if (!this.data || !this.data.links || !this.data.linkFolders) {
                    console.warn('⚠️ 数据源不完整，等待数据初始化...');
                    return false;
                }
                
                // 2. 获取DOM元素
                const totalLinksElement = document.getElementById('totalLinksCount');
                const totalFoldersElement = document.getElementById('totalFoldersCount');
                const totalTagsElement = document.getElementById('totalTagsCount');
                const headerStatsContainer = document.querySelector('.links-page-header .header-stats');
                
                // 3. 验证DOM元素是否存在
                if (!totalLinksElement || !totalFoldersElement || !totalTagsElement) {
                    console.warn('⚠️ 统计DOM元素未找到，可能页面未完全加载');
                    return false;
                }
                
                // 4. 计算统计数据
                const linksCount = this.data.links.length;
                const foldersCount = this.data.linkFolders.length;
                
                // 获取所有唯一标签
                const allTags = new Set();
                this.data.links.forEach(link => {
                    if (link.tags && Array.isArray(link.tags)) {
                        link.tags.forEach(tag => {
                            if (tag && tag.trim()) {
                                allTags.add(tag.trim());
                            }
                        });
                    }
                });
                const tagsCount = allTags.size;
                
                console.log('📊 统计数据计算结果:', { 
                    linksCount, 
                    foldersCount, 
                    tagsCount,
                    allTags: Array.from(allTags)
                });
                
                // 5. 更新DOM元素
                totalLinksElement.textContent = linksCount.toString();
                totalFoldersElement.textContent = foldersCount.toString();
                totalTagsElement.textContent = tagsCount.toString();
                
                // 6. 确保元素可见
                [totalLinksElement, totalFoldersElement, totalTagsElement].forEach(el => {
                    el.style.display = 'inline';
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                });
                
                // 7. 确保容器可见
                if (headerStatsContainer) {
                    headerStatsContainer.style.display = 'flex';
                    headerStatsContainer.style.visibility = 'visible';
                    headerStatsContainer.style.opacity = '1';
                }
                
                console.log('✅ 统计信息更新成功:', {
                    链接: linksCount,
                    文件夹: foldersCount,
                    标签: tagsCount
                });
                
                return true;
                
            } catch (error) {
                console.error('❌ 更新统计信息时出错:', error);
                return false;
            }
        };
        
        // 8. 多重保障的更新策略
        let updateAttempts = 0;
        const maxAttempts = 10;
        
        const attemptUpdate = () => {
            updateAttempts++;
            console.log(`🔄 第 ${updateAttempts} 次尝试更新统计信息`);
            
            if (updateStats()) {
                console.log('✅ 统计信息更新成功');
                return;
            }
            
            if (updateAttempts < maxAttempts) {
                // 指数退避策略
                const delay = Math.min(100 * Math.pow(2, updateAttempts - 1), 2000);
                setTimeout(attemptUpdate, delay);
            } else {
                console.error('❌ 统计信息更新失败，已达到最大尝试次数');
            }
        };
        
        // 立即开始更新
        attemptUpdate();
        
        // 额外保障：监听DOM变化
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const hasStatsElements = mutation.addedNodes.length > 0 && 
                            Array.from(mutation.addedNodes).some(node => 
                                node.nodeType === Node.ELEMENT_NODE && 
                                (node.id === 'totalLinksCount' || 
                                 node.id === 'totalFoldersCount' || 
                                 node.id === 'totalTagsCount')
                            );
                        
                        if (hasStatsElements) {
                            console.log('🔄 检测到统计元素变化，重新更新');
                            setTimeout(updateStats, 100);
                        }
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    

    
    // 渲染增强的文件夹标签
    renderEnhancedFolderTabs() {
        const container = document.getElementById('folderTabsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        // 添加全部文件夹标签
        const allTab = document.createElement('button');
        allTab.className = `folder-tab ${this.currentFolder === 'all' ? 'active' : ''}`;
        allTab.innerHTML = `
            <i class="fas fa-layer-group"></i>
            全部链接 (${this.data.links.length})
        `;
        allTab.addEventListener('click', () => {
            this.selectFolder('all');
        });
        container.appendChild(allTab);
        
        // 添加各个文件夹标签
        this.data.linkFolders.forEach(folder => {
            const tab = document.createElement('button');
            tab.className = `folder-tab ${folder.id === this.currentFolder ? 'active' : ''}`;
            
            // 计算文件夹中的链接数量
            const linkCount = this.data.links.filter(link => link.folderId === folder.id).length;
            
            tab.innerHTML = `
                <div class="folder-tab-content">
                    <i class="${folder.icon}"></i>
                    <span class="folder-name">${this.escapeHtml(folder.name)} (${linkCount})</span>
                </div>
                ${!folder.isDefault ? `
                    <div class="folder-tab-actions">
                        <button class="folder-action-btn" onclick="event.stopPropagation(); window.knowledgeBase.showFolderMenu(event, '${folder.id}')" title="文件夹操作">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                    </div>
                ` : ''}
            `;
            
            tab.addEventListener('click', () => {
                this.selectFolder(folder.id);
            });
            
            container.appendChild(tab);
        });
    }
    
    // 设置增强搜索功能
    setupEnhancedSearch() {
        const searchInput = document.getElementById('linksSearchInput');
        if (!searchInput) return;
        
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performLinksSearch(e.target.value);
            }, 300);
        });
    }
    
    // 执行链接搜索
    performLinksSearch(query) {
        const container = document.getElementById('linksGrid');
        if (!query.trim()) {
            this.displayFilteredLinks();
            return;
        }
        
        // 搜索链接
        const searchResults = this.data.links.filter(link => {
            const searchText = [
                link.title || '',
                link.description || '',
                link.url || '',
                ...(link.tags || [])
            ].join(' ').toLowerCase();
            
            return searchText.includes(query.toLowerCase());
        });
        
        // 显示搜索结果
        container.innerHTML = '';
        
        if (searchResults.length === 0) {
            container.innerHTML = this.getEmptyState('fas fa-search', `未找到匹配的链接`, `没有找到包含"${query}"的链接`);
        } else {
            searchResults.forEach(link => {
                const card = this.createLinkCard(link);
                container.appendChild(card);
            });
        }
    }
    
    // 设置添加链接按钮
    setupAddLinkButton() {
        const addBtn = document.getElementById('addContentFromLinks');
        if (addBtn) {
            // 移除之前的事件监听器（如果存在）
            const newBtn = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(newBtn, addBtn);
            
            // 添加新的事件监听器
            newBtn.addEventListener('click', () => {
                // 打开添加内容模态框并切换到链接标签
                this.showAddContentModal();
                this.switchTab('link');
            });
        }
    }
    
    // 更新批量操作栏显示
    updateBulkOperationsBar() {
        const bulkBar = document.getElementById('linkBulkOperationsBar');
        const countElement = document.getElementById('linkSelectedCount');
        
        if (this.linkBulkMode && bulkBar) {
            bulkBar.style.display = 'flex';
            if (countElement) {
                countElement.textContent = this.selectedLinks.size;
            }
        } else if (bulkBar) {
            bulkBar.style.display = 'none';
        }
    }
    
    // 显示所有链接（不按文件夹筛选）
    displayAllLinks() {
        const container = document.getElementById('linksGrid');
        
        // 获取筛选条件
        const tagFilter = document.getElementById('linkTagFilter')?.value || 'all';
        const sortFilter = document.getElementById('linkSortFilter')?.value || 'newest';
        
        // 筛选链接（不按文件夹筛选）
        let filteredLinks = this.data.links.filter(link => {
            // 只按标签筛选
            if (tagFilter !== 'all') {
                if (!link.tags || !link.tags.includes(tagFilter)) return false;
            }
            return true;
        });
        
        // 排序
        filteredLinks = this.sortLinks(filteredLinks, sortFilter);
        
        // 显示结果
        container.innerHTML = '';
        
        if (filteredLinks.length === 0) {
            if (this.data.links.length === 0) {
                container.innerHTML = this.getEmptyState('fas fa-link', '暂无链接', '开始添加您的第一个收藏链接');
            } else {
                container.innerHTML = this.getEmptyState('fas fa-search', '未找到匹配的链接', '尝试调整筛选条件');
            }
        } else {
            filteredLinks.forEach(link => {
                const card = this.createLinkCard(link);
                container.appendChild(card);
            });
        }
        
        // 设置批量模式状态
        if (this.linkBulkMode) {
            container.classList.add('bulk-mode');
        } else {
            container.classList.remove('bulk-mode');
        }
        
        // 更新批量选择信息
        this.updateLinkBulkSelectionInfo();
    }
    
    // 显示筛选后的链接
    displayFilteredLinks() {
        const container = document.getElementById('linksGrid');
        
        // 获取筛选条件
        const tagFilter = document.getElementById('linkTagFilter')?.value || 'all';
        const sortFilter = document.getElementById('linkSortFilter')?.value || 'newest';
        
        // 筛选链接（按当前文件夹和其他条件）
        let filteredLinks = this.data.links.filter(link => {
            // 文件夹筛选
            if (link.folderId !== this.currentFolder) {
                return false;
            }
            
            // 标签筛选
            if (tagFilter !== 'all') {
                if (!link.tags || !link.tags.includes(tagFilter)) return false;
            }
            
            return true;
        });
        
        // 排序
        filteredLinks = this.sortLinks(filteredLinks, sortFilter);
        
        // 显示结果
        container.innerHTML = '';
        
        if (filteredLinks.length === 0) {
            if (this.data.links.length === 0) {
                container.innerHTML = this.getEmptyState('fas fa-link', '暂无链接', '开始添加您的第一个收藏链接');
            } else {
                const currentFolderName = this.data.linkFolders.find(f => f.id === this.currentFolder)?.name || '当前文件夹';
                container.innerHTML = this.getEmptyState('fas fa-search', `在 "${currentFolderName}" 中未找到匹配的链接`, '尝试调整筛选条件或拖拽链接到此文件夹');
            }
        } else {
            filteredLinks.forEach(link => {
                const card = this.createLinkCard(link);
                container.appendChild(card);
            });
        }
        
        // 设置批量模式状态
        if (this.linkBulkMode) {
            container.classList.add('bulk-mode');
        } else {
            container.classList.remove('bulk-mode');
        }
        
        // 更新批量选择信息
        this.updateLinkBulkSelectionInfo();
    }
    
    // 链接排序
    sortLinks(links, sortType) {
        const sorted = [...links];
        
        switch (sortType) {
            case 'newest':
                return sorted.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
            case 'title':
                return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            default:
                return sorted;
        }
    }
    
    // 更新链接筛选器选项
    updateLinkFilterOptions() {
        this.updateLinkTagFilterOptions();
    }
    
    // 更新标签筛选器选项
    updateLinkTagFilterOptions() {
        const tagFilter = document.getElementById('linkTagFilter');
        if (!tagFilter) return;
        
        // 保存当前选中值
        const currentValue = tagFilter.value;
        
        // 清空选项
        tagFilter.innerHTML = '<option value="all">所有标签</option>';
        
        // 获取所有标签并按使用次数排序
        const tagUsage = {};
        this.data.links.forEach(link => {
            if (link.tags && Array.isArray(link.tags)) {
                link.tags.forEach(tag => {
                    tagUsage[tag] = (tagUsage[tag] || 0) + 1;
                });
            }
        });
        
        const sortedTags = Object.keys(tagUsage)
            .map(tag => ({ name: tag, count: tagUsage[tag] }))
            .sort((a, b) => b.count - a.count);
        
        // 添加标签选项
        sortedTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag.name;
            option.textContent = `${tag.name} (${tag.count})`;
            tagFilter.appendChild(option);
        });
        
        // 恢复之前的选中值
        if (currentValue && [...tagFilter.options].some(opt => opt.value === currentValue)) {
            tagFilter.value = currentValue;
        }
    }
    
    // 应用链接筛选
    applyLinkFilters() {
        this.displayFilteredLinks();
    }
    
    // 清除链接筛选器
    clearLinkFilters() {
        const tagFilter = document.getElementById('linkTagFilter');
        const sortFilter = document.getElementById('linkSortFilter');
        
        if (tagFilter) tagFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'newest';
        
        this.displayFilteredLinks();
    }
    
    // === 文件夹管理功能 ===
    
    // 设置文件夹管理功能
    setupFolderManagement() {
        this.setupCreateFolderModal();
        this.setupPasswordModal();
        this.setupFolderActions();
        this.renderFolders();
    }
    
    // 新增：搜索筛选器功能
    setupSearchFilters() {
        // 搜索类型筛选器
        document.getElementById('searchType')?.addEventListener('change', (e) => {
            this.performAdvancedSearch();
        });
        
        // 搜索排序筛选器
        document.getElementById('searchSort')?.addEventListener('change', (e) => {
            this.performAdvancedSearch();
        });
    }
    
    // 设置创建文件夹模态框
    setupCreateFolderModal() {
        const createBtn = document.getElementById('createFolderBtn');
        const modal = document.getElementById('createFolderModal');
        const closeBtn = document.getElementById('closeCreateFolderModal');
        const cancelBtn = document.getElementById('cancelCreateFolder');
        const confirmBtn = document.getElementById('confirmCreateFolder');
        const encryptionCheckbox = document.getElementById('enableEncryption');
        const encryptionSettings = document.getElementById('encryptionSettings');
        
        // 创建文件夹按钮
        createBtn?.addEventListener('click', () => {
            this.showCreateFolderModal();
        });
        
        // 关闭按钮
        [closeBtn, cancelBtn].forEach(btn => {
            btn?.addEventListener('click', () => {
                this.closeCreateFolderModal();
            });
        });
        
        // 确认创建
        confirmBtn?.addEventListener('click', () => {
            this.createFolder();
        });
        
        // 加密设置切换
        encryptionCheckbox?.addEventListener('change', () => {
            if (encryptionCheckbox.checked) {
                encryptionSettings.style.display = 'block';
            } else {
                encryptionSettings.style.display = 'none';
            }
        });
        
        // 颜色选择
        this.setupColorSelector();
        // 图标选择
        this.setupIconSelector();
    }
    
    // 设置颜色选择器
    setupColorSelector() {
        const colorOptions = document.querySelectorAll('.color-option');
        const hiddenInput = document.getElementById('selectedFolderColor');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 移除所有选中状态
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                // 添加当前选中
                option.classList.add('selected');
                // 更新隐藏输入框
                hiddenInput.value = option.dataset.color;
            });
        });
    }
    
    // 设置图标选择器
    setupIconSelector() {
        const iconOptions = document.querySelectorAll('.icon-option');
        const hiddenInput = document.getElementById('selectedFolderIcon');
        
        iconOptions.forEach(option => {
            option.addEventListener('click', () => {
                // 移除所有选中状态
                iconOptions.forEach(opt => opt.classList.remove('selected'));
                // 添加当前选中
                option.classList.add('selected');
                // 更新隐藏输入框
                hiddenInput.value = option.dataset.icon;
            });
        });
    }
    
    // 设置密码验证模态框
    setupPasswordModal() {
        const modal = document.getElementById('folderPasswordModal');
        const closeBtn = document.getElementById('closeFolderPasswordModal');
        const cancelBtn = document.getElementById('cancelFolderAccess');
        const confirmBtn = document.getElementById('confirmFolderAccess');
        const passwordInput = document.getElementById('accessPassword');
        
        [closeBtn, cancelBtn].forEach(btn => {
            btn?.addEventListener('click', () => {
                this.closeFolderPasswordModal();
            });
        });
        
        confirmBtn?.addEventListener('click', () => {
            this.verifyFolderPassword();
        });
        
        // 回车键提交
        passwordInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyFolderPassword();
            }
        });
    }
    
    // 设置文件夹操作
    setupFolderActions() {
        const toggleViewBtn = document.getElementById('toggleFolderView');
        
        toggleViewBtn?.addEventListener('click', () => {
            this.toggleFolderView();
        });
    }
    
    // 显示创建文件夹模态框
    showCreateFolderModal() {
        const modal = document.getElementById('createFolderModal');
        modal.classList.add('active');
        
        // 清空表单
        document.getElementById('createFolderForm').reset();
        document.getElementById('encryptionSettings').style.display = 'none';
        
        // 重置选择器
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
        
        // 默认选中第一个颜色和图标
        document.querySelector('.color-option').classList.add('selected');
        document.querySelector('.icon-option').classList.add('selected');
        
        // 自动聚焦名称输入框
        setTimeout(() => {
            document.getElementById('folderName').focus();
        }, 100);
    }
    
    // 关闭创建文件夹模态框
    closeCreateFolderModal() {
        const modal = document.getElementById('createFolderModal');
        modal.classList.remove('active');
        this.hideError('createFolderErrorContainer');
    }
    
    // 创建文件夹
    async createFolder() {
        try {
            // 获取表单数据
            const name = document.getElementById('folderName').value.trim();
            const description = document.getElementById('folderDescription').value.trim();
            const color = document.getElementById('selectedFolderColor').value;
            const icon = document.getElementById('selectedFolderIcon').value;
            const isEncrypted = document.getElementById('enableEncryption').checked;
            const password = document.getElementById('folderPassword').value;
            
            // 验证输入
            if (!name) {
                throw new Error('请输入文件夹名称');
            }
            
            if (isEncrypted && !password) {
                throw new Error('启用加密时必须设置密码');
            }
            
            // 检查名称是否重复
            if (this.data.linkFolders.some(folder => folder.name === name)) {
                throw new Error('文件夹名称已存在');
            }
            
            // 显示加载状态
            this.showButtonLoading('confirmCreateFolder', '创建中...');
            
            // 模拟异步操作
            await this.simulateAsyncOperation(800);
            
            // 创建文件夹对象
            const folder = {
                id: this.generateId(),
                name: name,
                description: description,
                color: color,
                icon: icon,
                isEncrypted: isEncrypted,
                password: isEncrypted ? this.hashPassword(password) : null,
                isDefault: false,
                createdAt: new Date().toISOString(),
                linkCount: 0
            };
            
            // 添加到数据中
            this.data.linkFolders.push(folder);
            
            // 保存数据
            this.saveData();
            
            // 更新显示
            this.renderFolders();
            this.renderEnhancedFolderTabs();
            this.updateLinksPageStats();
            
            // 显示成功提示
            this.showToast('创建成功', `文件夹 "${name}" 已创建`, 'success');
            
            // 关闭模态框
            this.closeCreateFolderModal();
            
        } catch (error) {
            this.showError('创建失败', error.message, 'createFolderErrorContainer');
        } finally {
            this.hideButtonLoading('confirmCreateFolder');
        }
    }
    
    // 显示文件夹操作菜单
    showFolderMenu(event, folderId) {
        const folder = this.data.linkFolders.find(f => f.id === folderId);
        if (!folder || folder.isDefault) return;
        
        // 创建菜单元素
        const existingMenu = document.querySelector('.folder-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const menu = document.createElement('div');
        menu.className = 'folder-context-menu';
        menu.innerHTML = `
            <div class="context-menu-item" onclick="window.knowledgeBase.editFolder('${folderId}')">
                <i class="fas fa-edit"></i>
                <span>编辑文件夹</span>
            </div>
            <div class="context-menu-item danger" onclick="window.knowledgeBase.deleteFolder('${folderId}')">
                <i class="fas fa-trash"></i>
                <span>删除文件夹</span>
            </div>
        `;
        
        // 设置菜单位置
        const rect = event.target.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.left = `${rect.left}px`;
        menu.style.zIndex = '10000';
        
        document.body.appendChild(menu);
        
        // 点击其他地方关闭菜单
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }
    
    // 编辑文件夹
    editFolder(folderId) {
        const folder = this.data.linkFolders.find(f => f.id === folderId);
        if (!folder || folder.isDefault) return;
        
        // 移除菜单
        const menu = document.querySelector('.folder-context-menu');
        if (menu) menu.remove();
        
        // 显示编辑模态框
        this.showEditFolderModal(folder);
    }
    
    // 删除文件夹
    async deleteFolder(folderId) {
        const folder = this.data.linkFolders.find(f => f.id === folderId);
        if (!folder || folder.isDefault) return;
        
        // 移除菜单
        const menu = document.querySelector('.folder-context-menu');
        if (menu) menu.remove();
        
        // 计算文件夹中的链接数量
        const linkCount = this.data.links.filter(link => link.folderId === folderId).length;
        
        // 显示确认对话框
        const confirmed = await this.showConfirmDialog(
            '删除文件夹',
            `确定要删除文件夹 "${folder.name}" 吗？${linkCount > 0 ? `\n\n此文件夹包含 ${linkCount} 个链接，删除后这些链接将移动到默认文件夹。` : ''}`,
            'danger'
        );
        
        if (!confirmed) return;
        
        try {
            // 将文件夹中的链接移动到默认文件夹
            this.data.links.forEach(link => {
                if (link.folderId === folderId) {
                    link.folderId = 'default';
                }
            });
            
            // 删除文件夹
            this.data.linkFolders = this.data.linkFolders.filter(f => f.id !== folderId);
            
            // 如果当前选中的是被删除的文件夹，切换到默认文件夹
            if (this.currentFolder === folderId) {
                this.currentFolder = 'all';
            }
            
            // 保存数据
            this.saveData();
            
            // 更新显示
            this.renderFolders();
            this.renderEnhancedFolderTabs();
            this.displayFilteredLinks();
            this.updateLinksPageStats();
            
            // 显示成功提示
            this.showToast('删除成功', `文件夹 "${folder.name}" 已删除`, 'success');
            
        } catch (error) {
            console.error('删除文件夹失败:', error);
            this.showToast('删除失败', '删除文件夹时发生错误', 'error');
        }
    }
    
    // 显示编辑文件夹模态框
    showEditFolderModal(folder) {
        // 创建编辑模态框
        const modal = document.createElement('div');
        modal.className = 'modal edit-folder-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>编辑文件夹</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="editFolderForm">
                        <div class="form-group">
                            <label for="editFolderName">文件夹名称</label>
                            <input type="text" id="editFolderName" value="${this.escapeHtml(folder.name)}" required>
                        </div>
                        <div class="form-group">
                            <label for="editFolderDescription">描述</label>
                            <textarea id="editFolderDescription" placeholder="文件夹描述（可选）">${this.escapeHtml(folder.description || '')}</textarea>
                        </div>
                        <div class="form-group">
                            <label>颜色</label>
                            <div class="color-picker">
                                <input type="color" id="editSelectedFolderColor" value="${folder.color}">
                                <div class="color-presets">
                                    <div class="color-preset" style="background-color: #6366f1" data-color="#6366f1"></div>
                                    <div class="color-preset" style="background-color: #10b981" data-color="#10b981"></div>
                                    <div class="color-preset" style="background-color: #f59e0b" data-color="#f59e0b"></div>
                                    <div class="color-preset" style="background-color: #ef4444" data-color="#ef4444"></div>
                                    <div class="color-preset" style="background-color: #8b5cf6" data-color="#8b5cf6"></div>
                                    <div class="color-preset" style="background-color: #06b6d4" data-color="#06b6d4"></div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>图标</label>
                            <div class="icon-picker">
                                <input type="hidden" id="editSelectedFolderIcon" value="${folder.icon}">
                                <div class="icon-presets">
                                    <div class="icon-preset ${folder.icon === 'fas fa-folder' ? 'active' : ''}" data-icon="fas fa-folder">
                                        <i class="fas fa-folder"></i>
                                    </div>
                                    <div class="icon-preset ${folder.icon === 'fas fa-briefcase' ? 'active' : ''}" data-icon="fas fa-briefcase">
                                        <i class="fas fa-briefcase"></i>
                                    </div>
                                    <div class="icon-preset ${folder.icon === 'fas fa-graduation-cap' ? 'active' : ''}" data-icon="fas fa-graduation-cap">
                                        <i class="fas fa-graduation-cap"></i>
                                    </div>
                                    <div class="icon-preset ${folder.icon === 'fas fa-heart' ? 'active' : ''}" data-icon="fas fa-heart">
                                        <i class="fas fa-heart"></i>
                                    </div>
                                    <div class="icon-preset ${folder.icon === 'fas fa-star' ? 'active' : ''}" data-icon="fas fa-star">
                                        <i class="fas fa-star"></i>
                                    </div>
                                    <div class="icon-preset ${folder.icon === 'fas fa-bookmark' ? 'active' : ''}" data-icon="fas fa-bookmark">
                                        <i class="fas fa-bookmark"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div class="error-message-container" id="editFolderErrorContainer"></div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary" onclick="this.closest('.modal').remove()">取消</button>
                    <button class="btn-primary" id="confirmEditFolder" onclick="window.knowledgeBase.updateFolder('${folder.id}')">
                        <span class="btn-text">保存修改</span>
                        <span class="btn-loading" style="display: none;">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span class="loading-text">保存中...</span>
                        </span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 设置颜色选择器事件
        this.setupColorPicker('editSelectedFolderColor');
        
        // 设置图标选择器事件
        this.setupIconPicker('editSelectedFolderIcon');
        
        // 显示模态框
        setTimeout(() => {
            modal.classList.add('active');
            document.getElementById('editFolderName').focus();
        }, 10);
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // 更新文件夹
    async updateFolder(folderId) {
        try {
            // 获取表单数据
            const name = document.getElementById('editFolderName').value.trim();
            const description = document.getElementById('editFolderDescription').value.trim();
            const color = document.getElementById('editSelectedFolderColor').value;
            const icon = document.getElementById('editSelectedFolderIcon').value;
            
            // 验证输入
            if (!name) {
                throw new Error('请输入文件夹名称');
            }
            
            // 检查名称是否重复（排除自己）
            if (this.data.linkFolders.some(folder => folder.name === name && folder.id !== folderId)) {
                throw new Error('文件夹名称已存在');
            }
            
            // 显示加载状态
            this.showButtonLoading('confirmEditFolder', '保存中...');
            
            // 模拟异步操作
            await this.simulateAsyncOperation(600);
            
            // 查找文件夹
            const folderIndex = this.data.linkFolders.findIndex(f => f.id === folderId);
            if (folderIndex === -1) {
                throw new Error('文件夹不存在');
            }
            
            // 更新文件夹信息
            this.data.linkFolders[folderIndex] = {
                ...this.data.linkFolders[folderIndex],
                name: name,
                description: description,
                color: color,
                icon: icon,
                updatedAt: new Date().toISOString()
            };
            
            // 保存数据
            this.saveData();
            
            // 更新显示
            this.renderFolders();
            this.renderEnhancedFolderTabs();
            this.displayFilteredLinks();
            this.updateLinksPageStats();
            
            // 显示成功提示
            this.showToast('更新成功', `文件夹 "${name}" 已更新`, 'success');
            
            // 关闭模态框
            const modal = document.querySelector('.edit-folder-modal');
            if (modal) modal.remove();
            
        } catch (error) {
            this.showError('更新失败', error.message, 'editFolderErrorContainer');
        } finally {
            this.hideButtonLoading('confirmEditFolder');
        }
    }
    
    // 显示确认对话框
    showConfirmDialog(title, message, type = 'warning') {
        return new Promise((resolve) => {
            // 创建确认对话框
            const modal = document.createElement('div');
            modal.className = 'modal confirm-dialog-modal';
            modal.innerHTML = `
                <div class="modal-content confirm-dialog">
                    <div class="modal-header ${type}">
                        <div class="confirm-icon">
                            <i class="fas ${type === 'danger' ? 'fa-exclamation-triangle' : 'fa-question-circle'}"></i>
                        </div>
                        <h2>${this.escapeHtml(title)}</h2>
                    </div>
                    <div class="modal-body">
                        <p class="confirm-message">${this.escapeHtml(message).replace(/\n/g, '<br>')}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary confirm-cancel">取消</button>
                        <button class="btn-${type === 'danger' ? 'danger' : 'primary'} confirm-ok">确定</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // 显示模态框
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // 绑定事件
            const cancelBtn = modal.querySelector('.confirm-cancel');
            const okBtn = modal.querySelector('.confirm-ok');
            
            const closeDialog = (result) => {
                modal.remove();
                resolve(result);
            };
            
            cancelBtn.addEventListener('click', () => closeDialog(false));
            okBtn.addEventListener('click', () => closeDialog(true));
            
            // 点击背景关闭
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeDialog(false);
                }
            });
            
            // 键盘事件
            const handleKeydown = (e) => {
                if (e.key === 'Escape') {
                    closeDialog(false);
                } else if (e.key === 'Enter') {
                    closeDialog(true);
                }
            };
            
            document.addEventListener('keydown', handleKeydown);
            
            // 清理事件监听器
            const originalResolve = resolve;
            resolve = (result) => {
                document.removeEventListener('keydown', handleKeydown);
                originalResolve(result);
            };
        });
    }
    
    // 简单密码哈希函数（仅用于演示，实际项目应使用更安全的哈希方法）
    hashPassword(password) {
        // 简单的哈希函数，仅用于演示
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }
    
    // 渲染文件夹列表
    renderFolders() {
        const container = document.getElementById('foldersContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.data.linkFolders.forEach(folder => {
            const folderCard = this.createFolderCard(folder);
            container.appendChild(folderCard);
        });
    }
    
    // 创建文件夹卡片
    createFolderCard(folder) {
        const card = document.createElement('div');
        card.className = `folder-card ${folder.isEncrypted ? 'encrypted' : ''} ${folder.id === this.currentFolder ? 'active' : ''}`;
        card.dataset.folderId = folder.id;
        
        // 设置拖拽事件
        this.setupFolderDropEvents(card, folder);
        
        card.innerHTML = `
            <div class="folder-header-content">
                <div class="folder-icon ${folder.isEncrypted ? 'encrypted' : ''}" style="background-color: ${folder.color}">
                    <i class="${folder.icon}"></i>
                </div>
                <div class="folder-info">
                    <h4 class="folder-name">${this.escapeHtml(folder.name)}</h4>
                    <p class="folder-description">${this.escapeHtml(folder.description || '没有描述')}</p>
                </div>
            </div>
            <div class="folder-stats">
                <div class="folder-link-count">
                    <i class="fas fa-link"></i>
                    <span>${folder.linkCount} 个链接</span>
                </div>
                <div class="folder-actions-menu">
                    <button class="folder-menu-btn" onclick="event.stopPropagation(); window.knowledgeBase.showFolderMenu('${folder.id}')">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </div>
        `;
        
        // 点击文件夹切换
        card.addEventListener('click', () => {
            this.selectFolder(folder.id);
        });
        
        return card;
    }
    
    // 选择文件夹
    async selectFolder(folderId) {
        const folder = this.data.linkFolders.find(f => f.id === folderId);
        if (!folder) return;
        
        // 如果文件夹加密且未解锁，显示密码输入
        if (folder.isEncrypted && !this.data.folderAccessStates[folderId]) {
            this.showFolderPasswordModal(folder);
            return;
        }
        
        // 切换文件夹
        this.currentFolder = folderId;
        
        // 更新UI
        this.updateCurrentFolderDisplay();
        this.renderFolders(); // 更新文件夹显示
        this.displayFilteredLinks(); // 更新链接显示
    }
    
    // 显示文件夹密码验证模态框
    showFolderPasswordModal(folder) {
        const modal = document.getElementById('folderPasswordModal');
        const folderName = document.getElementById('passwordFolderName');
        const folderDesc = document.getElementById('passwordFolderDesc');
        const folderIcon = document.querySelector('#passwordFolderInfo .folder-icon');
        
        // 设置文件夹信息
        folderName.textContent = folder.name;
        folderDesc.textContent = folder.description || '此文件夹受密码保护';
        folderIcon.style.backgroundColor = folder.color;
        folderIcon.innerHTML = `<i class="${folder.icon}"></i>`;
        
        // 存储当前文件夹ID
        this.currentPasswordFolder = folder.id;
        
        // 清空密码输入
        document.getElementById('accessPassword').value = '';
        
        // 显示模态框
        modal.classList.add('active');
        
        // 聚焦密码输入框
        setTimeout(() => {
            document.getElementById('accessPassword').focus();
        }, 100);
    }
    
    // 关闭文件夹密码模态框
    closeFolderPasswordModal() {
        const modal = document.getElementById('folderPasswordModal');
        modal.classList.remove('active');
        this.hideError('passwordErrorContainer');
        this.currentPasswordFolder = null;
    }
    
    // 验证文件夹密码
    async verifyFolderPassword() {
        try {
            const password = document.getElementById('accessPassword').value;
            
            if (!password) {
                throw new Error('请输入密码');
            }
            
            const folder = this.data.linkFolders.find(f => f.id === this.currentPasswordFolder);
            if (!folder) {
                throw new Error('文件夹不存在');
            }
            
            // 显示加载状态
            this.showButtonLoading('confirmFolderAccess', '验证中...');
            
            // 模拟异步操作
            await this.simulateAsyncOperation(600);
            
            // 验证密码
            const hashedPassword = this.hashPassword(password);
            if (hashedPassword !== folder.password) {
                throw new Error('密码错误');
            }
            
            // 记录访问状态
            this.data.folderAccessStates[folder.id] = true;
            
            // 关闭模态框
            this.closeFolderPasswordModal();
            
            // 切换到该文件夹
            this.selectFolder(folder.id);
            
            this.showToast('解锁成功', `文件夹 "${folder.name}" 已解锁`, 'success');
            
        } catch (error) {
            this.showError('验证失败', error.message, 'passwordErrorContainer');
        } finally {
            this.hideButtonLoading('confirmFolderAccess');
        }
    }
    
    // 更新当前文件夹显示
    updateCurrentFolderDisplay() {
        const folder = this.data.linkFolders.find(f => f.id === this.currentFolder);
        if (!folder) return;
        
        const titleElement = document.getElementById('currentFolderTitle');
        const breadcrumbElement = document.getElementById('folderBreadcrumb');
        
        if (titleElement) {
            titleElement.innerHTML = `
                <i class="${folder.icon}" style="color: ${folder.color}"></i>
                ${this.escapeHtml(folder.name)}
                ${folder.isEncrypted ? '<i class="fas fa-lock" style="color: var(--warning-color); margin-left: 8px;"></i>' : ''}
            `;
        }
        
        if (breadcrumbElement) {
            breadcrumbElement.innerHTML = `
                <span class="breadcrumb-item active">${this.escapeHtml(folder.name)}</span>
            `;
        }
    }
    
    // 切换文件夹查看模式
    toggleFolderView() {
        const container = document.getElementById('foldersContainer');
        const toggleBtn = document.getElementById('toggleFolderView');
        
        if (this.folderViewMode === 'grid') {
            this.folderViewMode = 'list';
            container.classList.add('list-view');
            toggleBtn.innerHTML = '<i class="fas fa-th"></i> 网格视图';
        } else {
            this.folderViewMode = 'grid';
            container.classList.remove('list-view');
            toggleBtn.innerHTML = '<i class="fas fa-th-large"></i> 列表视图';
        }
    }
    
    // 设置文件夹拖拽事件
    setupFolderDropEvents(folderCard, folder) {
        // 允许放置
        folderCard.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (this.isDraggingLink) {
                folderCard.classList.add('drag-over');
            }
        });
        
        // 离开拖拽区域
        folderCard.addEventListener('dragleave', () => {
            folderCard.classList.remove('drag-over');
        });
        
        // 放置操作
        folderCard.addEventListener('drop', (e) => {
            e.preventDefault();
            folderCard.classList.remove('drag-over');
            
            if (this.isDraggingLink && this.draggedLinkId) {
                this.moveToFolder(this.draggedLinkId, folder.id);
            }
        });
    }
    
    // 移动链接到文件夹
    async moveToFolder(linkId, folderId) {
        try {
            const link = this.data.links.find(l => l.id === linkId);
            const folder = this.data.linkFolders.find(f => f.id === folderId);
            
            if (!link || !folder) {
                throw new Error('链接或文件夹不存在');
            }
            
            // 如果是加密文件夹且未解锁，需要先解锁
            if (folder.isEncrypted && !this.data.folderAccessStates[folderId]) {
                this.showToast('提示', '请先解锁加密文件夹', 'warning');
                return;
            }
            
            // 更新链接的文件夹ID
            const oldFolderId = link.folderId;
            link.folderId = folderId;
            
            // 更新文件夹链接数量
            this.updateFolderLinkCounts();
            
            // 保存数据
            this.saveData();
            
            // 更新显示
            this.renderFolders();
            this.displayFilteredLinks();
            
            // 显示成功提示
            this.showToast('移动成功', `链接已移动到 "${folder.name}"`, 'success');
            
        } catch (error) {
            this.showToast('移动失败', error.message, 'error');
        } finally {
            // 重置拖拽状态
            this.isDraggingLink = false;
            this.draggedLinkId = null;
        }
    }
    
    // 设置链接拖拽事件
    setupLinkDragEvents(linkCard, link) {
        // 拖拽开始
        linkCard.addEventListener('dragstart', (e) => {
            this.isDraggingLink = true;
            this.draggedLinkId = link.id;
            linkCard.classList.add('dragging');
            
            // 设置拖拽数据
            e.dataTransfer.setData('text/plain', link.id);
            e.dataTransfer.effectAllowed = 'move';
            
            // 添加文件夹拖拽目标状态
            setTimeout(() => {
                document.querySelectorAll('.folder-card').forEach(folder => {
                    folder.classList.add('drag-active');
                });
            }, 0);
        });
        
        // 拖拽结束
        linkCard.addEventListener('dragend', () => {
            linkCard.classList.remove('dragging');
            
            // 移除文件夹拖拽状态
            document.querySelectorAll('.folder-card').forEach(folder => {
                folder.classList.remove('drag-active', 'drag-over');
            });
            
            // 少量延迟重置状态，确保拖拽操作完成
            setTimeout(() => {
                this.isDraggingLink = false;
                this.draggedLinkId = null;
            }, 100);
        });
    }
    
    // 设置链接批量操作功能
    setupLinkBulkOperations() {
        const toggleBtn = document.getElementById('toggleLinkBulkMode');
        const selectAllBtn = document.getElementById('selectAllLinks');
        const clearSelectionBtn = document.getElementById('clearLinkSelection');
        const bulkMoveCategoryBtn = document.getElementById('bulkMoveLinkCategory');
        const bulkDeleteBtn = document.getElementById('bulkDeleteLinks');
        
        if (!toggleBtn) return;
        
        // 切换批量模式
        toggleBtn.addEventListener('click', () => {
            this.toggleLinkBulkMode();
        });
        
        // 全选
        selectAllBtn?.addEventListener('click', () => {
            this.selectAllLinks();
        });
        
        // 清除选择
        clearSelectionBtn?.addEventListener('click', () => {
            this.clearLinkSelection();
        });
        
        // 批量移动分类
        bulkMoveCategoryBtn?.addEventListener('click', () => {
            this.showBulkLinkCategoryModal();
        });
        
        // 批量删除
        bulkDeleteBtn?.addEventListener('click', () => {
            this.bulkDeleteLinks();
        });
    }
    
    // 切换链接批量模式
    toggleLinkBulkMode() {
        this.linkBulkMode = !this.linkBulkMode;
        
        const toggleBtn = document.getElementById('toggleLinkBulkMode');
        const bulkBar = document.getElementById('linkBulkOperationsBar');
        const linksGrid = document.getElementById('linksGrid');
        
        if (this.linkBulkMode) {
            // 进入批量模式
            if (toggleBtn) {
                toggleBtn.classList.add('active');
                toggleBtn.innerHTML = '<i class="fas fa-times"></i> 取消选择';
                toggleBtn.style.background = '#ef4444';
                toggleBtn.style.color = 'white';
                toggleBtn.style.borderColor = '#ef4444';
            }
            
            if (bulkBar) {
                bulkBar.style.display = 'flex';
            }
            
            if (linksGrid) {
                linksGrid.classList.add('bulk-mode');
            }
        } else {
            // 退出批量模式
            if (toggleBtn) {
                toggleBtn.classList.remove('active');
                toggleBtn.innerHTML = '<i class="fas fa-check-square"></i> 批量选择';
                toggleBtn.style.background = '';
                toggleBtn.style.color = '';
                toggleBtn.style.borderColor = '';
            }
            
            if (bulkBar) {
                bulkBar.style.display = 'none';
            }
            
            if (linksGrid) {
                linksGrid.classList.remove('bulk-mode');
            }
            
            this.clearLinkSelection();
        }
        
        // 更新批量操作栏的显示
        this.updateBulkOperationsBar();
        
        // 重新显示链接以更新UI
        this.showLinks();
    }
    
    // 切换链接选择状态
    toggleLinkSelection(linkId) {
        if (this.selectedLinks.has(linkId)) {
            this.selectedLinks.delete(linkId);
        } else {
            this.selectedLinks.add(linkId);
        }
        
        this.updateLinkBulkSelectionInfo();
        
        // 重新渲染整个链接列表以确保复选框状态正确显示
        this.showLinks();
    }
    
    // 全选链接
    selectAllLinks() {
        this.data.links.forEach(link => {
            this.selectedLinks.add(link.id);
        });
        
        this.updateLinkBulkSelectionInfo();
        this.showLinks(); // 重新显示以更新选择状态
    }
    
    // 清除链接选择
    clearLinkSelection() {
        this.selectedLinks.clear();
        this.updateLinkBulkSelectionInfo();
        this.showLinks();
    }
    
    // 更新链接批量选择信息
    updateLinkBulkSelectionInfo() {
        // 更新新的批量操作栏中的计数
        const countElement = document.getElementById('linkSelectedCount');
        if (countElement) {
            countElement.textContent = this.selectedLinks.size;
        }
        
        // 更新原有的批量选择信息（兼容性）
        const oldCountElement = document.querySelector('#linkBulkSelectionInfo .selected-count');
        if (oldCountElement) {
            oldCountElement.textContent = this.selectedLinks.size;
        }
        
        // 获取各个按钮元素
        const selectAllBtn = document.getElementById('selectAllLinks');
        const clearSelectionBtn = document.getElementById('clearLinkSelection');
        const bulkMoveCategoryBtn = document.getElementById('bulkMoveLinkCategory');
        const bulkDeleteBtn = document.getElementById('bulkDeleteLinks');
        const bulkExportBtn = document.getElementById('bulkExportLinks');
        
        // 检查是否有链接可以操作
        const hasLinks = this.data.links && this.data.links.length > 0;
        const hasSelection = this.selectedLinks.size > 0;
        
        // 全选按钮：当有链接时启用，无链接时禁用
        if (selectAllBtn) {
            selectAllBtn.disabled = !hasLinks;
        }
        
        // 清除选择按钮：当有选择时启用，无选择时禁用
        if (clearSelectionBtn) {
            clearSelectionBtn.disabled = !hasSelection;
        }
        
        // 其他批量操作按钮：当有选择时启用，无选择时禁用
        [bulkMoveCategoryBtn, bulkDeleteBtn, bulkExportBtn].forEach(btn => {
            if (btn) {
                btn.disabled = !hasSelection;
            }
        });
        
        // 更新批量操作栏的显示
        this.updateBulkOperationsBar();
    }
    
    // 显示链接批量分类移动模态框
    showBulkLinkCategoryModal() {
        if (this.selectedLinks.size === 0) {
            this.showToast('提示', '请先选择要移动的链接', 'warning');
            return;
        }
        
        // 简单实现：显示确认对话框
        if (confirm(`确认要移动 ${this.selectedLinks.size} 个链接到新分类吗？`)) {
            // 这里可以扩展为完整的分类选择模态框
            this.showToast('成功', `已移动 ${this.selectedLinks.size} 个链接`, 'success');
            this.clearLinkSelection();
        }
    }
    
    // 批量删除链接
    bulkDeleteLinks() {
        if (this.selectedLinks.size === 0) {
            this.showToast('提示', '请先选择要删除的链接', 'warning');
            return;
        }
        
        if (confirm(`确认要删除 ${this.selectedLinks.size} 个链接吗？此操作不可恢复。`)) {
            // 执行删除操作
            const deletedCount = this.selectedLinks.size;
            
            // 从数据中删除选中的链接
            this.data.links = this.data.links.filter(link => !this.selectedLinks.has(link.id));
            
            // 清除选择状态
            this.selectedLinks.clear();
            
            // 保存数据并更新界面
            this.saveData();
            this.showLinks();
            this.updateStats();
            this.updateLinksPageStats(); // 更新链接页面统计
            this.updateLinkBulkSelectionInfo();
            
            this.showToast('成功', `已删除 ${deletedCount} 个链接`, 'success');
        }
    }
    
    // 设置链接智能标签推荐功能
    setupLinkSmartTags() {
        const linkUrlInput = document.getElementById('linkUrl');
        const analyzeLinkBtn = document.getElementById('analyzeLinkBtn');
        const refreshSuggestionsBtn = document.getElementById('refreshSuggestions');
        const linkTagsInput = document.getElementById('linkTags');
        
        if (!linkUrlInput || !analyzeLinkBtn || !linkTagsInput) return;
        
        // 监听 URL 输入
        linkUrlInput.addEventListener('input', () => {
            const url = linkUrlInput.value.trim();
            if (this.isValidUrl(url)) {
                analyzeLinkBtn.style.display = 'flex';
            } else {
                analyzeLinkBtn.style.display = 'none';
                this.hideSmartTagSuggestions();
            }
        });
        
        // 分析链接按钮
        analyzeLinkBtn.addEventListener('click', () => {
            this.analyzeLinkForTags();
        });
        
        // 重新分析按钮
        refreshSuggestionsBtn?.addEventListener('click', () => {
            this.analyzeLinkForTags();
        });
        
        // 标签输入框聚焦时显示历史标签
        linkTagsInput.addEventListener('focus', () => {
            this.showHistoryTagSuggestions();
        });
        
        // 标签输入框失去聚焦时隐藏历史标签
        linkTagsInput.addEventListener('blur', (e) => {
            // 延迟隐藏，以便点击标签推荐
            setTimeout(() => {
                this.hideHistoryTagSuggestions();
            }, 200);
        });
        
        // 标签输入框输入时的智能提示
        linkTagsInput.addEventListener('input', () => {
            this.filterHistoryTags(linkTagsInput.value);
        });
    }
    
    // 设置链接筛选功能
    setupLinkFilters() {
        const tagFilter = document.getElementById('linkTagFilter');
        const sortFilter = document.getElementById('linkSortFilter');
        const clearFiltersBtn = document.getElementById('clearLinkFilters');
        
        if (!tagFilter || !sortFilter) return;
        
        // 筛选器事件监听
        [tagFilter, sortFilter].forEach(filter => {
            filter.addEventListener('change', () => {
                this.applyLinkFilters();
            });
        });
        
        // 清除筛选按钮
        clearFiltersBtn?.addEventListener('click', () => {
            this.clearLinkFilters();
        });
        
        // 初始化筛选器选项
        this.updateLinkFilterOptions();
    }
    
    // 验证 URL 是否有效
    isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }
    
    // 分析链接获取智能标签推荐
    async analyzeLinkForTags() {
        const linkUrlInput = document.getElementById('linkUrl');
        const url = linkUrlInput.value.trim();
        
        if (!this.isValidUrl(url)) {
            this.showToast('错误', '请输入有效的 URL 地址', 'error');
            return;
        }
        
        // 显示加载状态
        this.setLinkAnalyzing(true);
        
        try {
            // 获取域名和路径信息
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            const path = urlObj.pathname;
            const searchParams = urlObj.search;
            
            // 基于 URL 分析生成标签推荐
            const suggestions = this.generateSmartTags(domain, path, searchParams, url);
            
            // 尝试获取网页标题和描述（由于 CORS 限制，这里主要依靠 URL 分析）
            await this.tryFetchPageInfo(url);
            
            // 显示推荐标签
            this.displaySmartTagSuggestions(suggestions);
            
        } catch (error) {
            console.error('分析链接失败:', error);
            this.showToast('提示', '无法自动获取网页信息，请手动添加标签', 'warning');
        } finally {
            // 隐藏加载状态
            this.setLinkAnalyzing(false);
        }
    }
    
    // 基于 URL 生成智能标签推荐
    generateSmartTags(domain, path, searchParams, fullUrl) {
        const suggestions = [];
        const confidence = {}; // 用于记录每个标签的置信度
        
        // 基于域名的标签推荐
        const domainTags = this.getDomainBasedTags(domain);
        domainTags.forEach(tag => {
            if (!suggestions.includes(tag)) {
                suggestions.push(tag);
                confidence[tag] = 90; // 域名匹配的置信度较高
            }
        });
        
        // 基于路径的标签推荐
        const pathTags = this.getPathBasedTags(path);
        pathTags.forEach(tag => {
            if (!suggestions.includes(tag)) {
                suggestions.push(tag);
                confidence[tag] = 70;
            } else {
                confidence[tag] = Math.min(confidence[tag] + 10, 95);
            }
        });
        
        // 基于参数的标签推荐
        const paramTags = this.getParamBasedTags(searchParams);
        paramTags.forEach(tag => {
            if (!suggestions.includes(tag)) {
                suggestions.push(tag);
                confidence[tag] = 60;
            } else {
                confidence[tag] = Math.min(confidence[tag] + 5, 95);
            }
        });
        
        // 按置信度排序并返回结果
        return suggestions
            .map(tag => ({ name: tag, confidence: confidence[tag] }))
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 8); // 最多 8 个推荐
    }
    
    // 基于域名的标签推荐
    getDomainBasedTags(domain) {
        const domainMappings = {
            // 技术相关
            'github.com': ['技本博客', '开源项目', '程序员'],
            'stackoverflow.com': ['技本博客', '问题解答', '编程'],
            'juejin.cn': ['技术博客', '前端开发', '编程'],
            'csdn.net': ['技术博客', '编程教程', 'IT技术'],
            'segmentfault.com': ['技本博客', '问题解答'],
            'zhihu.com': ['知识分享', '问题解答', '学习资料'],
            
            // 设计相关
            'dribbble.com': ['设计资源', 'UI设计', '创意灵感'],
            'behance.net': ['设计资源', '作品展示', '创意灵感'],
            'figma.com': ['设计工具', 'UI设计', '设计资源'],
            'pinterest.com': ['设计灵感', '创意资源', '图片收藏'],
            
            // 学习相关
            'coursera.org': ['学习资料', '在线课程', '教育'],
            'udemy.com': ['学习资料', '在线课程', '技能提升'],
            'edx.org': ['学习资料', '在线课程', '大学课程'],
            'khanacademy.org': ['学习资料', '免费教育', '基础教学'],
            
            // 工具相关
            'notion.so': ['工具软件', '生产力工具', '知识管理'],
            'trello.com': ['工具软件', '项目管理', '团队协作'],
            'slack.com': ['工具软件', '团队协作', '沟通工具'],
            
            // 娱乐相关
            'youtube.com': ['视频内容', '娱乐休闲', '学习资料'],
            'bilibili.com': ['视频内容', '娱乐休闲', '学习资料'],
            'netflix.com': ['娱乐休闲', '影视内容'],
        };
        
        // 精确匹配
        if (domainMappings[domain]) {
            return domainMappings[domain];
        }
        
        // 模糊匹配
        const fuzzyMatches = [];
        Object.keys(domainMappings).forEach(key => {
            if (domain.includes(key) || key.includes(domain)) {
                fuzzyMatches.push(...domainMappings[key]);
            }
        });
        
        return [...new Set(fuzzyMatches)];
    }
    
    // 基于路径的标签推荐
    getPathBasedTags(path) {
        const pathMappings = {
            // 技术相关路径
            'blog': ['技术博客', '文章'],
            'tutorial': ['教程', '学习资料'],
            'course': ['课程', '学习资料'],
            'documentation': ['文档', '参考资料'],
            'api': ['接口文档', '技术文档'],
            
            // 设计相关路径
            'design': ['设计资源', '创意灵感'],
            'portfolio': ['作品展示', '个人作品'],
            'gallery': ['图片收藏', '作品展示'],
            
            // 工具相关路径
            'tool': ['工具软件', '实用工具'],
            'app': ['应用程序', '软件工具'],
            'download': ['软件下载', '资源下载'],
            
            // 娱乐相关路径
            'video': ['视频内容', '娱乐休闲'],
            'music': ['音乐', '娱乐休闲'],
            'game': ['游戏', '娱乐休闲']
        };
        
        const tags = [];
        const lowerPath = path.toLowerCase();
        
        Object.keys(pathMappings).forEach(keyword => {
            if (lowerPath.includes(keyword)) {
                tags.push(...pathMappings[keyword]);
            }
        });
        
        return [...new Set(tags)];
    }
    
    // 基于参数的标签推荐
    getParamBasedTags(searchParams) {
        const tags = [];
        const lowerParams = searchParams.toLowerCase();
        
        // 检查常见参数关键词
        const paramMappings = {
            'tutorial': ['教程'],
            'course': ['课程'],
            'design': ['设计'],
            'tool': ['工具'],
            'video': ['视频'],
            'blog': ['博客'],
            'api': ['接口']
        };
        
        Object.keys(paramMappings).forEach(keyword => {
            if (lowerParams.includes(keyword)) {
                tags.push(...paramMappings[keyword]);
            }
        });
        
        return [...new Set(tags)];
    }
    
    // 尝试获取网页信息（受 CORS 限制）
    async tryFetchPageInfo(url) {
        try {
            // 由于 CORS 限制，这里只能做基本尝试
            // 在实际生产环境中，可以使用后端代理或第三方 API
            // 这里主要依靠 URL 分析来推荐标签
            console.log('尝试获取网页信息:', url);
        } catch (error) {
            console.log('无法获取网页信息:', error);
        }
    }
    
    // 设置链接分析状态
    setLinkAnalyzing(isAnalyzing) {
        const linkForm = document.getElementById('linkTab');
        const analyzeLinkBtn = document.getElementById('analyzeLinkBtn');
        
        if (isAnalyzing) {
            linkForm.classList.add('analyzing-link');
            analyzeLinkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';
            analyzeLinkBtn.disabled = true;
        } else {
            linkForm.classList.remove('analyzing-link');
            analyzeLinkBtn.innerHTML = '<i class="fas fa-magic"></i> 分析网页';
            analyzeLinkBtn.disabled = false;
        }
    }
    
    // 显示智能标签推荐
    displaySmartTagSuggestions(suggestions) {
        const container = document.getElementById('smartTagSuggestions');
        const suggestedTagsContainer = document.getElementById('suggestedTags');
        
        if (!container || !suggestedTagsContainer || suggestions.length === 0) {
            this.hideSmartTagSuggestions();
            return;
        }
        
        // 清空容器
        suggestedTagsContainer.innerHTML = '';
        
        // 添加推荐标签
        suggestions.forEach(suggestion => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-suggestion smart';
            tagElement.innerHTML = `
                <span>${suggestion.name}</span>
                <span class="tag-confidence">${suggestion.confidence}</span>
            `;
            
            tagElement.addEventListener('click', () => {
                this.toggleTagSuggestion(tagElement, suggestion.name);
            });
            
            suggestedTagsContainer.appendChild(tagElement);
        });
        
        // 显示容器
        container.style.display = 'block';
    }
    
    // 隐藏智能标签推荐
    hideSmartTagSuggestions() {
        const container = document.getElementById('smartTagSuggestions');
        if (container) {
            container.style.display = 'none';
        }
    }
    
    // 显示历史标签推荐
    showHistoryTagSuggestions() {
        const container = document.getElementById('historyTagSuggestions');
        const historyTagsContainer = document.getElementById('historyTags');
        
        if (!container || !historyTagsContainer) return;
        
        // 获取历史标签（按使用频次排序）
        const historyTags = this.getLinkHistoryTags();
        
        if (historyTags.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        // 清空容器
        historyTagsContainer.innerHTML = '';
        
        // 添加历史标签
        historyTags.slice(0, 10).forEach(tag => { // 最多显示 10 个
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-suggestion history';
            tagElement.innerHTML = `
                <span>${tag.name}</span>
                <span class="tag-usage-count">${tag.count}</span>
            `;
            
            tagElement.addEventListener('click', () => {
                this.toggleTagSuggestion(tagElement, tag.name);
            });
            
            historyTagsContainer.appendChild(tagElement);
        });
        
        // 显示容器
        container.style.display = 'block';
    }
    
    // 隐藏历史标签推荐
    hideHistoryTagSuggestions() {
        const container = document.getElementById('historyTagSuggestions');
        if (container) {
            container.style.display = 'none';
        }
    }
    
    // 筛选历史标签
    filterHistoryTags(searchTerm) {
        if (!searchTerm.trim()) {
            this.showHistoryTagSuggestions();
            return;
        }
        
        const container = document.getElementById('historyTagSuggestions');
        const historyTagsContainer = document.getElementById('historyTags');
        
        if (!container || !historyTagsContainer) return;
        
        // 获取匹配的历史标签
        const historyTags = this.getLinkHistoryTags();
        const filteredTags = historyTags.filter(tag => 
            tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filteredTags.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        // 清空容器
        historyTagsContainer.innerHTML = '';
        
        // 添加筛选后的标签
        filteredTags.slice(0, 8).forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-suggestion history';
            tagElement.innerHTML = `
                <span>${tag.name}</span>
                <span class="tag-usage-count">${tag.count}</span>
            `;
            
            tagElement.addEventListener('click', () => {
                this.toggleTagSuggestion(tagElement, tag.name);
            });
            
            historyTagsContainer.appendChild(tagElement);
        });
        
        // 显示容器
        container.style.display = 'block';
    }
    
    // 切换标签推荐的选中状态
    toggleTagSuggestion(tagElement, tagName) {
        const linkTagsInput = document.getElementById('linkTags');
        const currentTags = linkTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        if (tagElement.classList.contains('selected')) {
            // 取消选中
            tagElement.classList.remove('selected');
            const tagIndex = currentTags.indexOf(tagName);
            if (tagIndex > -1) {
                currentTags.splice(tagIndex, 1);
            }
        } else {
            // 选中
            tagElement.classList.add('selected');
            if (!currentTags.includes(tagName)) {
                currentTags.push(tagName);
            }
        }
        
        // 更新标签输入框
        linkTagsInput.value = currentTags.join(', ');
        
        // 触发输入事件以更新其他相关显示
        linkTagsInput.dispatchEvent(new Event('input'));
    }
    
    // 获取链接历史标签（按使用频次排序）
    getLinkHistoryTags() {
        // 统计所有链接中的标签使用频次
        const tagUsage = {};
        
        this.data.links.forEach(link => {
            if (link.tags && Array.isArray(link.tags)) {
                link.tags.forEach(tag => {
                    tagUsage[tag] = (tagUsage[tag] || 0) + 1;
                });
            }
        });
        
        // 转换为数组并按使用频次排序
        return Object.keys(tagUsage)
            .map(tag => ({ name: tag, count: tagUsage[tag] }))
            .sort((a, b) => b.count - a.count);
    }
    
    // 更新链接标签统计
    updateLinkTagStats(tags) {
        if (!Array.isArray(tags)) return;
        
        // 更新或创建标签统计
        tags.forEach(tagName => {
            let existingTag = this.data.linkTags.find(tag => tag.name === tagName);
            
            if (existingTag) {
                existingTag.count += 1;
                existingTag.lastUsed = new Date().toISOString();
            } else {
                // 创建新标签
                const newTag = {
                    id: this.generateId(),
                    name: tagName,
                    count: 1,
                    color: this.generateTagColor(),
                    createdAt: new Date().toISOString(),
                    lastUsed: new Date().toISOString()
                };
                this.data.linkTags.push(newTag);
            }
        });
        
        // 按使用频次排序
        this.data.linkTags.sort((a, b) => b.count - a.count);
    }
    
    // 显示笔记
    showNotes() {
        const container = document.getElementById('notesGrid');
        container.innerHTML = '';
        
        if (this.data.notes.length === 0) {
            container.innerHTML = this.getEmptyState('fas fa-sticky-note', '暂无笔记', '开始创建您的第一条笔记');
            return;
        }
        
        this.data.notes.forEach(note => {
            const card = this.createNoteCard(note);
            container.appendChild(card);
        });
    }
    
    // 创建内容卡片
    createContentCard(item) {
        const card = document.createElement('div');
        
        // 检查是否是文档类型
        if (item.category === 'documents') {
            const docType = this.getDocumentType(item.name, item.type);
            card.className = `content-card document-card ${docType.type}`;
            
            card.innerHTML = `
                <div class="content-card-actions">
                    <button class="action-btn edit-btn" onclick="window.knowledgeBase.editItem('${item.id}', '${item.category}')" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="window.knowledgeBase.deleteItem('${item.id}', '${item.category}')" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="file-type-indicator">${docType.label}</div>
                <div class="card-content">
                    <i class="file-icon ${docType.icon}"></i>
                    <h3 class="card-title">${item.name || item.title}</h3>
                    <p class="card-description">${item.description || '文档文件'}</p>
                    <div class="card-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(item.uploadDate)}</span>
                        <span><i class="fas fa-file"></i> ${this.formatFileSize(item.size)}</span>
                    </div>
                    <div class="card-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <button class="preview-btn" title="预览文档">
                    <i class="fas fa-eye"></i>
                </button>
            `;
            
            // 添加预览事件
            const previewBtn = card.querySelector('.preview-btn');
            if (previewBtn) {
                previewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('点击预览按钮:', item);
                    this.openDocumentPreview(item);
                });
                console.log('预览按钮事件已绑定:', item.name);
            } else {
                console.error('预览按钮未找到:', item.name);
            }
        } else {
            // 非文档类型保持原有样式
            card.className = 'content-card';
            card.innerHTML = `
                <div class="card-content">
                    <h3 class="card-title">${item.name || item.title}</h3>
                    <p class="card-description">${item.description || '文档文件'}</p>
                    <div class="card-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(item.uploadDate)}</span>
                        <span><i class="fas fa-file"></i> ${this.formatFileSize(item.size)}</span>
                    </div>
                    <div class="card-tags">
                        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
        }
        
        card.addEventListener('click', () => {
            this.openItem(item);
        });
        
        return card;
    }
    
    // 创建图片卡片
    createImageCard(image, index = 0) {
        const card = document.createElement('div');
        card.className = 'content-card image-card';
        card.draggable = true;
        card.dataset.imageId = image.id;
        
        // 在批量模式下添加bulk-mode类
        if (this.bulkMode) {
            card.classList.add('bulk-mode');
        }
        
        // 检查是否被选中
        const isSelected = this.selectedImages.has(image.id);
        if (isSelected) {
            card.classList.add('selected');
        }
        
        // 获取图片分类信息
        const category = this.getCategoryById(image.imageCategory || 'general');
        
        // 获取关联笔记数量
        const associatedNotesCount = this.data.imageNoteAssociations.filter(assoc => assoc.imageId === image.id).length;
        
        // 处理标签显示（限制3个）
        const tagsToShow = (image.tags || []).slice(0, 3);
        const hasMoreTags = (image.tags || []).length > 3;
        
        card.innerHTML = `
            <div class="image-selection-checkbox ${isSelected ? 'checked' : ''}">
                <i class="fas fa-check" style="display: ${isSelected ? 'block' : 'none'}; color: white;"></i>
            </div>
            <div class="content-card-actions">
                <button class="action-btn detail-btn" onclick="window.knowledgeBase.showImageDetailModal('${image.id}')" title="详情">
                    <i class="fas fa-info-circle"></i>
                </button>
                <button class="action-btn delete-btn" onclick="window.knowledgeBase.deleteItem('${image.id}', '${image.category}')" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <!-- 分类标识 -->
            <div class="image-category-badge" style="background-color: ${category.color}" title="分类：${category.name}">
                <i class="${category.icon}"></i>
            </div>
            
            <!-- 图片质量标识 -->
            ${image.compressed ? '<div class="image-quality-badge" title="已压缩"><i class="fas fa-compress-alt"></i></div>' : ''}
            
            <img src="${image.dataUrl}" alt="${image.name}" class="card-image">
            
            <div class="card-content">
                <h3 class="card-title">${this.escapeHtml(image.name)}</h3>
                
                <!-- 描述信息 -->
                ${image.description ? `<p class="card-description">${this.escapeHtml(image.description)}</p>` : ''}
                
                <div class="card-meta">
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(image.uploadDate)}</span>
                    <span><i class="fas fa-file"></i> ${this.formatFileSize(image.size)}</span>
                    ${associatedNotesCount > 0 ? `<span class="notes-count" title="关联笔记"><i class="fas fa-sticky-note"></i> ${associatedNotesCount}</span>` : ''}
                </div>
                
                <!-- 标签显示 -->
                ${tagsToShow.length > 0 ? `
                    <div class="card-tags">
                        ${tagsToShow.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                        ${hasMoreTags ? `<span class="tag more-tags">+${(image.tags || []).length - 3}</span>` : ''}
                    </div>
                ` : ''}
                
                <!-- 快速操作区域 -->
                <div class="card-quick-actions">
                    <button class="quick-action-btn category-btn" title="分类：${category.name}">
                        <i class="${category.icon}"></i>
                        <span>${category.name}</span>
                    </button>
                    ${associatedNotesCount > 0 ? `
                        <button class="quick-action-btn notes-btn" title="关联笔记">
                            <i class="fas fa-sticky-note"></i>
                            <span>${associatedNotesCount}</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        // 添加点击事件
        card.addEventListener('click', (e) => {
            // 检查是否点击的是按钮或复选框
            if (e.target.closest('.action-btn') || e.target.closest('.image-selection-checkbox') || e.target.closest('.quick-action-btn')) {
                return;
            }
            
            if (this.bulkMode) {
                // 批量模式下切换选中状态
                this.toggleImageSelection(image.id);
            } else {
                // 正常模式下打开预览
                const imageIndex = this.data.images.findIndex(img => img.id === image.id);
                this.openImagePreview(imageIndex);
            }
        });
        
        // 添加复选框点击事件
        const checkbox = card.querySelector('.image-selection-checkbox');
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleImageSelection(image.id);
        });
        
        // 添加快速操作按钮事件
        const categoryBtn = card.querySelector('.category-btn');
        categoryBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            // 打开分类管理对话框
            this.showCategoryManagement();
        });
        
        const notesBtn = card.querySelector('.notes-btn');
        notesBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            // 打开图片详情模态框并定位到笔记区域
            this.showImageDetailModal(image.id);
            setTimeout(() => {
                const noteSection = document.querySelector('#imageDetailModal .associated-notes-display');
                if (noteSection) {
                    noteSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 300);
        });
        
        // 添加拖拽事件
        this.setupImageDragEvents(card, image);
        
        return card;
    }
    
    // 创建视频卡片
    createVideoCard(video) {
        const card = document.createElement('div');
        card.className = 'content-card';
        card.innerHTML = `
            <div class="content-card-actions">
                <button class="action-btn edit-btn" onclick="window.knowledgeBase.editItem('${video.id}', '${video.category}')" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="window.knowledgeBase.deleteItem('${video.id}', '${video.category}')" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="card-content">
                <h3 class="card-title">${video.name}</h3>
                <p class="card-description">视频文件</p>
                <div class="card-meta">
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(video.uploadDate)}</span>
                    <span><i class="fas fa-file"></i> ${this.formatFileSize(video.size)}</span>
                </div>
                <div class="card-tags">
                    ${video.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            // 检查是否点击的是按钮
            if (e.target.closest('.action-btn')) {
                return; // 不处理打开
            }
            
            this.openItem(video);
        });
        
        return card;
    }
    
    // 创建链接卡片
    createLinkCard(link) {
        const card = document.createElement('div');
        card.className = 'content-card link-card';
        card.dataset.linkId = link.id;
        
        // 在批量模式下添加bulk-mode类
        if (this.linkBulkMode) {
            card.classList.add('bulk-mode');
        }
        
        // 检查是否被选中
        const isSelected = this.selectedLinks && this.selectedLinks.has(link.id);
        if (isSelected) {
            card.classList.add('selected');
        }
        
        // 设置拖拽属性
        card.draggable = true;
        
        // 获取域名作为显示标识
        const domain = this.extractDomain(link.url);
        
        // 获取文件夹名称
        const folder = this.data.linkFolders.find(f => f.id === link.folderId);
        const folderName = folder ? folder.name : '默认文件夹';
        
        card.innerHTML = `
            <div class="card-checkbox ${isSelected ? 'checked' : ''}">
                <i class="fas fa-check" style="display: ${isSelected ? 'block' : 'none'};"></i>
            </div>
            
            <div class="card-header">
                <h3 class="card-title">${this.escapeHtml(link.title)}</h3>
                <a href="${link.url}" class="card-url" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i>
                    ${domain}
                </a>
            </div>
            
            <div class="card-body">
                ${link.description ? `<p class="card-description">${this.escapeHtml(link.description)}</p>` : ''}
                
                ${link.tags && link.tags.length > 0 ? `
                    <div class="card-tags">
                        ${link.tags.slice(0, 4).map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                        ${link.tags.length > 4 ? `<span class="tag">+${link.tags.length - 4}</span>` : ''}
                    </div>
                ` : ''}
            </div>
            
            <div class="card-footer">
                <div class="card-meta">
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(link.uploadDate)}</span>
                    <span><i class="fas fa-folder"></i> ${this.escapeHtml(folderName)}</span>
                </div>
                <div class="card-actions">
                    <button class="action-btn" onclick="window.knowledgeBase.editItem('${link.id}', '${link.category}')" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn danger" onclick="window.knowledgeBase.deleteItem('${link.id}', '${link.category}')" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // 添加点击事件
        card.addEventListener('click', (e) => {
            // 检查是否点击的是按钮、复选框或链接
            if (e.target.closest('.action-btn') || 
                e.target.closest('.card-checkbox') || 
                e.target.closest('.card-url')) {
                return;
            }
            
            if (this.linkBulkMode) {
                // 批量模式下切换选中状态
                this.toggleLinkSelection(link.id);
            } else {
                // 正常模式下打开链接
                e.preventDefault();
                window.open(link.url, '_blank', 'noopener,noreferrer');
            }
        });
        
        // 添加复选框点击事件
        const checkbox = card.querySelector('.card-checkbox');
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.linkBulkMode) {
                this.toggleLinkSelection(link.id);
            }
        });
        
        // 添加拖拽事件
        this.setupLinkDragEvents(card, link);
        
        return card;
    }
    
    // 创建笔记卡片
    createNoteCard(note) {
        const card = document.createElement('div');
        card.className = 'content-card';
        
        // 获取纯文本内容用于预览
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = note.content;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        card.innerHTML = `
            <div class="content-card-actions">
                <button class="action-btn edit-btn" onclick="window.knowledgeBase.editItem('${note.id}', '${note.category}')" title="编辑">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="window.knowledgeBase.deleteItem('${note.id}', '${note.category}')" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="card-content">
                <h3 class="card-title">${note.title}</h3>
                <p class="card-description">${textContent.substring(0, 100)}${textContent.length > 100 ? '...' : ''}</p>
                <div class="card-meta">
                    <span><i class="fas fa-calendar"></i> ${this.formatDate(note.uploadDate)}</span>
                    <span><i class="fas fa-sticky-note"></i> 笔记</span>
                </div>
                <div class="card-tags">
                    ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            // 检查是否点击的是按钮
            if (e.target.closest('.action-btn')) {
                return; // 不处理打开
            }
            
            this.openItem(note);
        });
        
        return card;
    }
    
    // 显示最近项目
    showRecentItems() {
        const container = document.getElementById('recentItems');
        container.innerHTML = '';
        
        // 获取所有项目并按日期排序
        const allItems = [
            ...this.data.documents,
            ...this.data.images,
            ...this.data.videos,
            ...this.data.links,
            ...this.data.notes
        ].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)).slice(0, 6);
        
        if (allItems.length === 0) {
            container.innerHTML = this.getEmptyState('fas fa-clock', '暂无最近项目', '开始添加您的第一个内容');
            return;
        }
        
        allItems.forEach(item => {
            let card;
            if (item.category === 'images') {
                card = this.createImageCard(item);
                // 为最近项目中的图片添加特殊处理
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const imageIndex = this.data.images.findIndex(img => img.id === item.id);
                    this.openImagePreview(imageIndex);
                });
            } else if (item.category === 'links') {
                card = this.createLinkCard(item);
            } else if (item.category === 'notes') {
                card = this.createNoteCard(item);
            } else if (item.category === 'videos') {
                card = this.createVideoCard(item);
            } else {
                card = this.createContentCard(item);
            }
            container.appendChild(card);
        });
    }
    
    // 更新统计信息
    updateStats() {
        document.getElementById('documentsCount').textContent = this.data.documents.length;
        document.getElementById('imagesCount').textContent = this.data.images.length;
        document.getElementById('videosCount').textContent = this.data.videos.length;
        document.getElementById('linksCount').textContent = this.data.links.length;
        
        // 更新近7天新增量
        this.updateRecentStats();
    }
    
    // 计算近7天新增量
    getRecentCount(items) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        return items.filter(item => {
            const uploadDate = new Date(item.uploadDate || item.createdAt);
            return uploadDate >= sevenDaysAgo;
        }).length;
    }
    
    // 更新近7天新增统计
    updateRecentStats() {
        // 计算各类别近7天新增量
        const recentDocuments = this.getRecentCount(this.data.documents);
        const recentImages = this.getRecentCount(this.data.images);
        const recentVideos = this.getRecentCount(this.data.videos);
        const recentLinks = this.getRecentCount(this.data.links);
        
        // 更新DOM显示
        this.updateRecentStatDisplay('documents', recentDocuments);
        this.updateRecentStatDisplay('images', recentImages);
        this.updateRecentStatDisplay('videos', recentVideos);
        this.updateRecentStatDisplay('links', recentLinks);
    }
    
    // 更新单个近7天新增统计显示
    updateRecentStatDisplay(category, count) {
        const element = document.getElementById(`${category}RecentCount`);
        if (element) {
            element.textContent = count;
            // 根据数量显示不同的颜色
            if (count > 0) {
                element.className = 'recent-count positive';
            } else {
                element.className = 'recent-count';
            }
        }
    }
    
    // 执行全局搜索
    performGlobalSearch(query) {
        if (!query.trim()) {
            this.refreshCurrentSection();
            return;
        }
        
        if (this.currentSection === 'search') {
            this.showSearchResults(query);
        }
    }
    
    // 新增：执行高级搜索
    performAdvancedSearch() {
        const searchInput = document.getElementById('globalSearch');
        const query = searchInput ? searchInput.value.trim() : '';
        const searchType = document.getElementById('searchType')?.value || 'all';
        const searchSort = document.getElementById('searchSort')?.value || 'newest';
        
        if (!query) {
            this.showSearchResults('');
            return;
        }
        
        // 根据类型筛选内容
        let allItems = [];
        if (searchType === 'all') {
            allItems = [
                ...this.data.documents,
                ...this.data.images,
                ...this.data.videos,
                ...this.data.links,
                ...this.data.notes
            ];
        } else {
            switch (searchType) {
                case 'documents':
                    allItems = this.data.documents;
                    break;
                case 'images':
                    allItems = this.data.images;
                    break;
                case 'videos':
                    allItems = this.data.videos;
                    break;
                case 'links':
                    allItems = this.data.links;
                    break;
                case 'notes':
                    allItems = this.data.notes;
                    break;
            }
        }
        
        // 搜索过滤
        const results = allItems.filter(item => {
            const searchText = (
                (item.name || '') +
                (item.title || '') +
                (item.content || '') +
                (item.description || '') +
                (item.tags || []).join(' ')
            ).toLowerCase();
            
            return searchText.includes(query.toLowerCase());
        });
        
        // 排序结果
        this.sortSearchResults(results, searchSort);
        
        // 显示结果
        this.displaySearchResults(results, query);
        
        // 添加到搜索历史
        this.addSearchHistory(query);
    }
    
    // 新增：排序搜索结果
    sortSearchResults(results, sortType) {
        switch (sortType) {
            case 'newest':
                results.sort((a, b) => {
                    const dateA = new Date(a.uploadDate || a.createdAt || 0);
                    const dateB = new Date(b.uploadDate || b.createdAt || 0);
                    return dateB - dateA;
                });
                break;
            case 'oldest':
                results.sort((a, b) => {
                    const dateA = new Date(a.uploadDate || a.createdAt || 0);
                    const dateB = new Date(b.uploadDate || b.createdAt || 0);
                    return dateA - dateB;
                });
                break;
            case 'name':
                results.sort((a, b) => {
                    const nameA = (a.name || a.title || '').toLowerCase();
                    const nameB = (b.name || b.title || '').toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                break;
        }
    }
    
    // 新增：显示搜索结果（带高亮）
    displaySearchResults(results, query) {
        const container = document.getElementById('searchResults');
        
        if (!container) return;
        
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = this.getEmptyState('fas fa-search', '未找到相关内容', `没有找到包含"${query}"的内容`);
            return;
        }
        
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'content-grid';
        
        results.forEach(item => {
            let card;
            if (item.category === 'images') {
                card = this.createImageCard(item);
                // 更新点击事件以使用搜索结果作为图片列表
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const imageResults = results.filter(r => r.category === 'images');
                    const imageIndex = imageResults.findIndex(img => img.id === item.id);
                    this.openImagePreview(imageIndex, imageResults);
                });
            } else if (item.category === 'links') {
                card = this.createLinkCard(item);
            } else if (item.category === 'notes') {
                card = this.createNoteCard(item);
            } else {
                card = this.createContentCard(item);
            }
            
            // 高亮搜索结果中的关键词
            this.highlightSearchTerms(card, query);
            
            resultsGrid.appendChild(card);
        });
        
        container.appendChild(resultsGrid);
    }
    
    // 新增：高亮搜索关键词
    highlightSearchTerms(card, query) {
        if (!query.trim()) return;
        
        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        const textElements = card.querySelectorAll('.card-title, .card-description, .card-meta');
        
        textElements.forEach(element => {
            let text = element.textContent;
            let highlightedText = text;
            
            searchTerms.forEach(term => {
                const regex = new RegExp(`(${term})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<mark class="search-highlight">$1</mark>');
            });
            
            if (highlightedText !== text) {
                element.innerHTML = highlightedText;
            }
        });
    }
    
    // 新增：添加搜索历史
    addSearchHistory(query) {
        if (!query.trim()) return;
        
        // 移除重复的搜索记录
        this.data.searchHistory = this.data.searchHistory.filter(item => item.query !== query);
        
        // 添加到历史记录开头
        this.data.searchHistory.unshift({
            query: query,
            timestamp: new Date().toISOString(),
            resultCount: this.getSearchResultCount(query)
        });
        
        // 限制历史记录数量（最多保存20条）
        if (this.data.searchHistory.length > 20) {
            this.data.searchHistory = this.data.searchHistory.slice(0, 20);
        }
        
        this.saveData();
    }
    
    // 新增：获取搜索结果数量
    getSearchResultCount(query) {
        const allItems = [
            ...this.data.documents,
            ...this.data.images,
            ...this.data.videos,
            ...this.data.links,
            ...this.data.notes
        ];
        
        return allItems.filter(item => {
            const searchText = (
                (item.name || '') +
                (item.title || '') +
                (item.content || '') +
                (item.description || '') +
                (item.tags || []).join(' ')
            ).toLowerCase();
            
            return searchText.includes(query.toLowerCase());
        }).length;
    }
    
    // 新增：显示搜索历史
    showSearchHistory() {
        const container = document.getElementById('searchResults');
        
        if (!container || this.data.searchHistory.length === 0) {
            return;
        }
        
        const historyHTML = `
            <div class="search-history-section">
                <h3><i class="fas fa-history"></i> 搜索历史</h3>
                <div class="search-history-list">
                    ${this.data.searchHistory.map(item => `
                        <div class="search-history-item" onclick="knowledgeBase.performSearchFromHistory('${item.query}')">
                            <div class="history-query">
                                <i class="fas fa-search"></i>
                                <span>${this.escapeHtml(item.query)}</span>
                            </div>
                            <div class="history-meta">
                                <span class="history-count">${item.resultCount} 个结果</span>
                                <span class="history-time">${this.formatRelativeTime(item.timestamp)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button class="btn-secondary clear-history-btn" onclick="knowledgeBase.clearSearchHistory()">
                    <i class="fas fa-trash"></i> 清除历史
                </button>
            </div>
        `;
        
        container.innerHTML = historyHTML;
    }
    
    // 新增：从历史记录执行搜索
    performSearchFromHistory(query) {
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.value = query;
        }
        this.performAdvancedSearch();
    }
    
    // 新增：清除搜索历史
    clearSearchHistory() {
        this.data.searchHistory = [];
        this.saveData();
        this.showSearchHistory();
    }
    
    // 新增：格式化相对时间
    formatRelativeTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = now - time;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return '刚刚';
        if (minutes < 60) return `${minutes}分钟前`;
        if (hours < 24) return `${hours}小时前`;
        if (days < 7) return `${days}天前`;
        
        return time.toLocaleDateString();
    }
    
    // 显示搜索结果
    showSearchResults(query = '') {
        const container = document.getElementById('searchResults');
        const searchInput = document.getElementById('globalSearch');
        
        if (!query) {
            query = searchInput.value.trim();
        }
        
        if (!query) {
            // 显示搜索历史或默认提示
            if (this.data.searchHistory && this.data.searchHistory.length > 0) {
                this.showSearchHistory();
            } else {
                container.innerHTML = this.getEmptyState('fas fa-search', '输入关键词搜索', '在上方搜索框中输入您要查找的内容');
            }
            return;
        }
        
        // 使用新的高级搜索功能
        this.performAdvancedSearch();
    }
    
    // 打开项目
    openItem(item) {
        // 根据项目类型处理不同的打开方式
        if (item.category === 'notes') {
            this.openNoteViewer(item);
        } else {
            // 其他类型项目的处理逻辑
            console.log('Opening item:', item);
        }
    }

    // 打开笔记查看器 - 简化版直接编辑模式
    openNoteViewer(note) {
        this.currentViewingNote = note;
        this.isEditingNote = true; // 直接进入编辑模式
        
        // 显示模态框
        const modal = document.getElementById('noteViewerModal');
        modal.classList.add('active');
        
        // 填充笔记内容到编辑器
        this.populateSimplifiedNoteViewer(note);
        
        // 设置事件监听器
        this.setupSimplifiedNoteViewerEvents();
        
        // 设置自动保存
        this.setupAutoSave();
    }

    // 填充笔记查看器内容
    populateNoteViewer(note) {
        // 设置标题
        document.getElementById('noteViewerTitle').textContent = note.title;
        
        // 设置日期信息
        document.getElementById('noteCreatedDate').textContent = this.formatDate(note.uploadDate || note.createdAt);
        
        const updatedDate = note.updatedAt || note.uploadDate || note.createdAt;
        document.getElementById('noteUpdatedDate').textContent = updatedDate ? 
            `最近更新: ${this.formatDate(updatedDate)}` : '未更新';
        
        // 设置内容
        const contentDisplay = document.getElementById('noteContentDisplay');
        contentDisplay.innerHTML = note.content || '<p>暂无内容</p>';
        
        // 设置标签
        const tagsDisplay = document.getElementById('noteTagsDisplay');
        if (note.tags && note.tags.length > 0) {
            tagsDisplay.innerHTML = note.tags.map(tag => 
                `<span class="tag">${this.escapeHtml(tag)}</span>`
            ).join('');
            tagsDisplay.style.display = 'flex';
        } else {
            tagsDisplay.style.display = 'none';
        }
        
        // 填充编辑表单（为编辑模式准备）
        document.getElementById('noteViewerEditTitle').value = note.title;
        document.getElementById('noteViewerEditContent').innerHTML = note.content || '';
        document.getElementById('noteViewerEditTags').value = (note.tags || []).join(', ');
    }

    // 简化版笔记查看器填充方法
    populateSimplifiedNoteViewer(note) {
        // 填充标题输入框
        const titleInput = document.getElementById('noteViewerTitle');
        if (titleInput) {
            titleInput.value = note.title || '新笔记';
        }
        
        // 填充内容编辑器
        const contentEditor = document.getElementById('noteViewerContent');
        if (contentEditor) {
            contentEditor.innerHTML = note.content || '';
        }
        
        // 填充标签输入框
        const tagsInput = document.getElementById('noteViewerTags');
        if (tagsInput) {
            tagsInput.value = (note.tags || []).join(', ');
        }
        
        // 更新自动保存状态
        this.updateAutoSaveStatus('saved');
    }

    // 设置笔记查看器事件监听器
    setupNoteViewerEvents() {
        // 防止重复绑定
        if (this.noteViewerEventsSetup) return;
        this.noteViewerEventsSetup = true;
        
        const modal = document.getElementById('noteViewerModal');
        const closeBtn = document.getElementById('noteViewerClose');
        const editToggleBtn = document.getElementById('noteEditToggle');
        const editBtn = document.getElementById('noteEditBtn');
        const cancelBtn = document.getElementById('noteEditCancel');
        const saveBtn = document.getElementById('noteEditSave');
        const deleteBtn = document.getElementById('noteDeleteBtn');
        
        // 关闭按钮
        closeBtn.addEventListener('click', () => {
            this.closeNoteViewer();
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeNoteViewer();
            }
        });
        
        // 编辑按钮
        [editToggleBtn, editBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    this.toggleNoteEditMode();
                });
            }
        });
        
        // 取消编辑
        cancelBtn.addEventListener('click', () => {
            this.cancelNoteEdit();
        });
        
        // 保存编辑
        saveBtn.addEventListener('click', () => {
            this.saveNoteEdit();
        });
        
        // 删除笔记
        deleteBtn.addEventListener('click', () => {
            this.deleteNoteFromViewer();
        });
        
        // 设置富文本编辑器
        this.setupNoteViewerRichTextEditor();
        
        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                if (this.isEditingNote) {
                    this.cancelNoteEdit();
                } else {
                    this.closeNoteViewer();
                }
            }
        });
    }

    // 简化版事件监听器设置
    setupSimplifiedNoteViewerEvents() {
        // 防止重复绑定
        if (this.simplifiedNoteViewerEventsSetup) return;
        this.simplifiedNoteViewerEventsSetup = true;
        
        const modal = document.getElementById('noteViewerModal');
        const closeBtn = modal.querySelector('.modal-close');
        const deleteBtn = document.getElementById('noteDeleteBtn');
        
        // 关闭按钮事件
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeNoteViewer();
            });
        }
        
        // 删除按钮事件
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteNoteFromViewer();
            });
        }
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeNoteViewer();
            }
        });
        
        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeNoteViewer();
            }
        });
        
        // 设置富文本编辑器
        this.setupSimplifiedRichTextEditor();
    }

    // 设置自动保存功能
    setupAutoSave() {
        // 清除之前的定时器
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        
        const titleInput = document.getElementById('noteViewerTitle');
        const contentEditor = document.getElementById('noteViewerContent');
        const tagsInput = document.getElementById('noteViewerTags');
        
        // 防抖自动保存函数
        const debouncedAutoSave = () => {
            // 清除之前的定时器
            if (this.autoSaveTimer) {
                clearTimeout(this.autoSaveTimer);
            }
            
            // 显示保存中状态
            this.updateAutoSaveStatus('saving');
            
            // 1.5秒后执行保存
            this.autoSaveTimer = setTimeout(() => {
                this.performAutoSave();
            }, 1500);
        };
        
        // 监听输入事件
        if (titleInput) {
            titleInput.addEventListener('input', debouncedAutoSave);
            titleInput.addEventListener('blur', debouncedAutoSave);
        }
        
        if (contentEditor) {
            contentEditor.addEventListener('input', debouncedAutoSave);
            contentEditor.addEventListener('blur', debouncedAutoSave);
        }
        
        if (tagsInput) {
            tagsInput.addEventListener('input', debouncedAutoSave);
            tagsInput.addEventListener('blur', debouncedAutoSave);
        }
    }

    // 执行自动保存
    async performAutoSave() {
        try {
            if (!this.currentViewingNote) return;
            
            const titleInput = document.getElementById('noteViewerTitle');
            const contentEditor = document.getElementById('noteViewerContent');
            const tagsInput = document.getElementById('noteViewerTags');
            
            const title = titleInput ? titleInput.value.trim() : '';
            const content = contentEditor ? contentEditor.innerHTML.trim() : '';
            const tagsStr = tagsInput ? tagsInput.value.trim() : '';
            const tags = tagsStr ? tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
            
            // 基本验证
            if (!title && !content) {
                this.updateAutoSaveStatus('saved');
                return;
            }
            
            // 检查是否有实际变化
            const currentNote = this.currentViewingNote;
            if (currentNote.title === title && 
                currentNote.content === content && 
                JSON.stringify(currentNote.tags || []) === JSON.stringify(tags)) {
                this.updateAutoSaveStatus('saved');
                return;
            }
            
            // 更新笔记数据
            const noteIndex = this.data.notes.findIndex(n => n.id === currentNote.id);
            if (noteIndex !== -1) {
                this.data.notes[noteIndex] = {
                    ...this.data.notes[noteIndex],
                    title: title || '未命名笔记',
                    content: content,
                    tags: tags,
                    updatedAt: new Date().toISOString()
                };
                
                // 更新当前查看的笔记引用
                this.currentViewingNote = this.data.notes[noteIndex];
                
                // 保存到本地存储
                this.saveData();
                
                // 更新状态为已保存
                this.updateAutoSaveStatus('saved');
                
                // 刷新页面显示（如果当前在笔记页面）
                if (this.currentSection === 'notes') {
                    this.showNotes();
                }
                this.showRecentItems();
                
                console.log('✅ 自动保存成功');
            }
            
        } catch (error) {
            console.error('❌ 自动保存失败:', error);
            this.updateAutoSaveStatus('error');
        }
    }

    // 更新自动保存状态显示
    updateAutoSaveStatus(status) {
        const statusElement = document.getElementById('autoSaveStatus');
        if (!statusElement) return;
        
        // 移除所有状态类
        statusElement.classList.remove('saving', 'saved', 'error');
        
        // 添加当前状态类
        statusElement.classList.add(status);
        
        const iconElement = statusElement.querySelector('i');
        const textElement = statusElement.querySelector('span');
        
        switch (status) {
            case 'saving':
                if (iconElement) iconElement.className = 'fas fa-spinner fa-spin';
                if (textElement) textElement.textContent = '保存中...';
                break;
            case 'saved':
                if (iconElement) iconElement.className = 'fas fa-check-circle';
                if (textElement) textElement.textContent = '已保存';
                break;
            case 'error':
                if (iconElement) iconElement.className = 'fas fa-exclamation-triangle';
                if (textElement) textElement.textContent = '保存失败';
                break;
        }
    }

    // 显示查看模式
    showNoteViewMode() {
        this.isEditingNote = false;
        document.getElementById('noteViewMode').style.display = 'flex';
        document.getElementById('noteEditMode').style.display = 'none';
        document.getElementById('noteViewActions').style.display = 'flex';
        document.getElementById('noteEditActions').style.display = 'none';
        
        // 更新按钮状态
        const editToggleBtn = document.getElementById('noteEditToggle');
        if (editToggleBtn) {
            editToggleBtn.innerHTML = '<i class="fas fa-edit"></i><span>编辑</span>';
        }
    }

    // 显示编辑模式
    showNoteEditMode() {
        this.isEditingNote = true;
        document.getElementById('noteViewMode').style.display = 'none';
        document.getElementById('noteEditMode').style.display = 'flex';
        document.getElementById('noteViewActions').style.display = 'none';
        document.getElementById('noteEditActions').style.display = 'flex';
        
        // 更新按钮状态
        const editToggleBtn = document.getElementById('noteEditToggle');
        if (editToggleBtn) {
            editToggleBtn.innerHTML = '<i class="fas fa-eye"></i><span>预览</span>';
        }
        
        // 自动聚焦标题输入框
        setTimeout(() => {
            document.getElementById('noteViewerEditTitle').focus();
        }, 100);
    }

    // 切换编辑模式
    toggleNoteEditMode() {
        if (this.isEditingNote) {
            this.showNoteViewMode();
        } else {
            this.showNoteEditMode();
        }
    }

    // 取消编辑
    cancelNoteEdit() {
        // 重新填充原始数据
        if (this.currentViewingNote) {
            this.populateNoteViewer(this.currentViewingNote);
        }
        this.showNoteViewMode();
    }

    // 保存编辑
    async saveNoteEdit() {
        try {
            // 获取编辑的数据
            const title = document.getElementById('noteViewerEditTitle').value.trim();
            const content = document.getElementById('noteViewerEditContent').innerHTML.trim();
            const tagsStr = document.getElementById('noteViewerEditTags').value.trim();
            const tags = tagsStr ? tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
            
            // 验证数据
            if (!title) {
                throw new Error('请输入笔记标题');
            }
            
            if (!content || content === '<div><br></div>' || content === '<br>') {
                throw new Error('请输入笔记内容');
            }
            
            // 显示加载状态
            const saveBtn = document.getElementById('noteEditSave');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
            saveBtn.disabled = true;
            
            // 模拟异步操作
            await this.simulateAsyncOperation(600);
            
            // 更新笔记数据
            const noteIndex = this.data.notes.findIndex(n => n.id === this.currentViewingNote.id);
            if (noteIndex !== -1) {
                this.data.notes[noteIndex] = {
                    ...this.data.notes[noteIndex],
                    title: title,
                    content: content,
                    tags: tags,
                    updatedAt: new Date().toISOString()
                };
                
                // 更新当前查看的笔记
                this.currentViewingNote = this.data.notes[noteIndex];
                
                // 保存数据
                this.saveData();
                
                // 重新填充查看器
                this.populateNoteViewer(this.currentViewingNote);
                
                // 切换到查看模式
                this.showNoteViewMode();
                
                // 显示成功提示
                this.showToast('保存成功', '笔记已成功更新', 'success');
                
                // 刷新页面显示
                if (this.currentSection === 'notes') {
                    this.showNotes();
                }
                this.showRecentItems();
            }
            
        } catch (error) {
            this.showToast('保存失败', error.message, 'error');
        } finally {
            // 恢复按钮状态
            const saveBtn = document.getElementById('noteEditSave');
            saveBtn.innerHTML = '<i class="fas fa-save"></i> 保存';
            saveBtn.disabled = false;
        }
    }

    // 从查看器删除笔记
    async deleteNoteFromViewer() {
        if (!this.currentViewingNote) return;
        
        const confirmed = await this.showConfirmDialog(
            '删除笔记',
            `确定要删除笔记"${this.currentViewingNote.title}"吗？\n\n此操作不可撤销。`,
            'danger'
        );
        
        if (confirmed) {
            // 执行删除
            this.data.notes = this.data.notes.filter(n => n.id !== this.currentViewingNote.id);
            this.saveData();
            
            // 关闭查看器
            this.closeNoteViewer();
            
            // 显示成功提示
            this.showToast('删除成功', '笔记已删除', 'success');
            
            // 刷新页面显示
            if (this.currentSection === 'notes') {
                this.showNotes();
            }
            this.showRecentItems();
            this.updateStats();
        }
    }

    // 关闭笔记查看器
    closeNoteViewer() {
        // 清理自动保存定时器
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
        
        // 如果正在保存，等待保存完成
        if (this.currentViewingNote) {
            this.performAutoSave();
        }
        
        const modal = document.getElementById('noteViewerModal');
        modal.classList.remove('active');
        this.currentViewingNote = null;
        this.isEditingNote = false;
        
        // 重置事件监听器标记
        this.noteViewerEventsSetup = false;
        this.simplifiedNoteViewerEventsSetup = false;
    }

    // 设置笔记查看器的富文本编辑器
    setupNoteViewerRichTextEditor() {
        const editorContent = document.getElementById('noteViewerEditContent');
        const toolbar = document.querySelector('.note-viewer-editor .editor-toolbar');
        const formatSelect = document.getElementById('noteViewerFormatSelect');
        const imageUpload = document.getElementById('noteViewerImageUpload');
        
        if (!editorContent || !toolbar) return;
        
        // 工具栏按钮事件
        toolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('.toolbar-btn');
            if (btn) {
                e.preventDefault();
                this.execNoteViewerCommand(btn.dataset.command, btn, editorContent);
            }
        });
        
        // 格式选择器
        if (formatSelect) {
            formatSelect.addEventListener('change', () => {
                const value = formatSelect.value;
                if (value) {
                    document.execCommand('formatBlock', false, value);
                    this.updateNoteViewerToolbarState(toolbar);
                }
            });
        }
        
        // 编辑器内容变化
        editorContent.addEventListener('input', () => {
            this.updateNoteViewerToolbarState(toolbar);
        });
        
        // 选区变化
        document.addEventListener('selectionchange', () => {
            if (editorContent.contains(document.getSelection().anchorNode)) {
                this.updateNoteViewerToolbarState(toolbar);
            }
        });
        
        // 图片上传事件
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.insertImageIntoNoteViewer(file, editorContent);
                }
            });
        }
        
        // Enter 键处理
        editorContent.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                setTimeout(() => {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        if (range.commonAncestorContainer === editorContent) {
                            document.execCommand('formatBlock', false, 'div');
                        }
                    }
                }, 0);
            }
        });
    }

    // 简化版富文本编辑器设置
    setupSimplifiedRichTextEditor() {
        const contentEditor = document.getElementById('noteViewerContent');
        if (!contentEditor) return;
        
        // 设置可编辑
        contentEditor.contentEditable = true;
        contentEditor.style.outline = 'none';
        
        // 基本的键盘快捷键支持
        contentEditor.addEventListener('keydown', (e) => {
            // Ctrl+B: 加粗
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                document.execCommand('bold');
            }
            // Ctrl+I: 斜体
            else if (e.ctrlKey && e.key === 'i') {
                e.preventDefault();
                document.execCommand('italic');
            }
            // Ctrl+U: 下划线
            else if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                document.execCommand('underline');
            }
            // Enter: 创建新段落
            else if (e.key === 'Enter' && !e.shiftKey) {
                // 让浏览器处理默认行为
            }
        });
        
        // 防止粘贴时带入格式
        contentEditor.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
        
        // 保持焦点以便用户直接开始输入
        setTimeout(() => {
            contentEditor.focus();
        }, 100);
    }

    // 执行笔记查看器命令
    execNoteViewerCommand(command, button, editorContent) {
        switch (command) {
            case 'createLink':
                const url = prompt('请输入链接地址:', 'https://');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
                break;
                
            case 'insertImage':
                document.getElementById('noteViewerImageUpload').click();
                break;
                
            default:
                document.execCommand(command, false, null);
                break;
        }
        
        this.updateNoteViewerToolbarState(button.closest('.editor-toolbar'));
    }

    // 更新笔记查看器工具栏状态
    updateNoteViewerToolbarState(toolbar) {
        const buttons = toolbar.querySelectorAll('.toolbar-btn');
        
        buttons.forEach(button => {
            const command = button.dataset.command;
            if (command && ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'].includes(command)) {
                const isActive = document.queryCommandState(command);
                button.classList.toggle('active', isActive);
            }
        });
    }

    // 在笔记查看器中插入图片
    insertImageIntoNoteViewer(file, editorContent) {
        if (!file.type.startsWith('image/')) {
            this.showToast('错误', '请选择图片文件', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            // 在当前光标位置插入图片
            editorContent.focus();
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(img);
                
                // 将光标移到图片后面
                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        };
        reader.readAsDataURL(file);
    }
    
    // 获取空状态HTML
    getEmptyState(icon, title, description) {
        return `
            <div class="empty-state">
                <i class="${icon}"></i>
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
        `;
    }
    
    // 提取域名
    extractDomain(url) {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch {
            return url;
        }
    }
    
    // 获取文档类型
    getDocumentType(filename, mimeType = '') {
        const extension = filename.split('.').pop().toLowerCase();
        const type = mimeType.toLowerCase();
        
        if (extension === 'pdf' || type.includes('pdf')) {
            return { type: 'pdf', label: 'PDF', icon: 'fas fa-file-pdf' };
        } else if (['doc', 'docx'].includes(extension) || type.includes('word') || type.includes('document')) {
            return { type: 'word', label: 'Word', icon: 'fas fa-file-word' };
        } else if (['xls', 'xlsx'].includes(extension) || type.includes('excel') || type.includes('spreadsheet')) {
            return { type: 'excel', label: 'Excel', icon: 'fas fa-file-excel' };
        } else if (['ppt', 'pptx'].includes(extension) || type.includes('powerpoint') || type.includes('presentation')) {
            return { type: 'powerpoint', label: 'PPT', icon: 'fas fa-file-powerpoint' };
        } else if (['txt', 'md', 'rtf'].includes(extension) || type.includes('text')) {
            return { type: 'text', label: 'TXT', icon: 'fas fa-file-alt' };
        } else {
            return { type: 'other', label: '文档', icon: 'fas fa-file' };
        }
    }
    
    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    // 格式化文件大小
    formatFileSize(bytes) {
        if (!bytes) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // 添加默认测试链接
    addDefaultLinksForTesting() {
        const defaultLinks = [
            {
                id: this.generateId(),
                url: "https://github.com",
                title: "GitHub",
                description: "全球最大的代码托管平台",
                tags: ["开发", "代码", "开源"],
                folderId: 'default',
                uploadDate: new Date().toISOString(),
                category: 'links'
            },
            {
                id: this.generateId(),
                url: "https://stackoverflow.com",
                title: "Stack Overflow",
                description: "程序员问答社区",
                tags: ["编程", "问答", "技术"],
                folderId: 'default',
                uploadDate: new Date().toISOString(),
                category: 'links'
            }
        ];
        
        defaultLinks.forEach(link => {
            this.data.links.push(link);
        });
        
        this.saveData();
    }
    
    // 添加额外测试数据确保统计显示
    addDefaultTestData() {
        console.log('添加额外测试数据...');
        
        // 添加更多链接数据
        const moreLinks = [
            {
                id: this.generateId(),
                url: "https://developer.mozilla.org",
                title: "MDN Web Docs",
                description: "Web开发者文档",
                tags: ["文档", "前端", "学习"],
                folderId: 'default',
                uploadDate: new Date().toISOString(),
                category: 'links'
            },
            {
                id: this.generateId(),
                url: "https://www.runoob.com",
                title: "菜鸟教程",
                description: "编程学习网站",
                tags: ["教程", "学习", "编程"],
                folderId: 'default',
                uploadDate: new Date().toISOString(),
                category: 'links'
            },
            {
                id: this.generateId(),
                url: "https://www.w3schools.com",
                title: "W3Schools",
                description: "Web技术学习平台",
                tags: ["教程", "Web", "前端"],
                folderId: 'default',
                uploadDate: new Date().toISOString(),
                category: 'links'
            }
        ];
        
        // 添加额外文件夹
        const testFolder = {
            id: this.generateId(),
            name: '学习资源',
            description: '编程学习相关的链接',
            color: '#10b981',
            icon: 'fas fa-graduation-cap',
            isEncrypted: false,
            password: null,
            isDefault: false,
            createdAt: new Date().toISOString(),
            linkCount: 0
        };
        
        // 检查是否已存在，避免重复添加
        const hasTestData = this.data.links.some(link => link.title === 'MDN Web Docs');
        const hasTestFolder = this.data.linkFolders.some(folder => folder.name === '学习资源');
        
        if (!hasTestData) {
            moreLinks.forEach(link => {
                this.data.links.push(link);
            });
            console.log('已添加额外链接数据');
        }
        
        if (!hasTestFolder) {
            this.data.linkFolders.push(testFolder);
            console.log('已添加测试文件夹');
        }
        
        this.saveData();
        
        // 输出最终统计
        console.log('最终数据统计:', {
            链接数量: this.data.links.length,
            文件夹数量: this.data.linkFolders.length,
            标签数量: this.getAllUniqueTags().size
        });
    }
    
    // 获取所有唯一标签
    getAllUniqueTags() {
        const allTags = new Set();
        this.data.links.forEach(link => {
            if (link.tags && Array.isArray(link.tags)) {
                link.tags.forEach(tag => allTags.add(tag));
            }
        });
        return allTags;
    }
    
    // 保存数据到本地存储
    saveData() {
        try {
            localStorage.setItem('knowledgeBaseData', JSON.stringify(this.data));
            localStorage.setItem('lastBackupDate', new Date().toISOString());
            this.logAuditEvent('data_saved', {
                itemCount: this.data.documents.length + this.data.images.length + 
                          this.data.videos.length + this.data.links.length + this.data.notes.length
            });
        } catch (error) {
            console.error('数据保存失败:', error);
            this.logAuditEvent('data_save_error', { error: error.message });
        }
    }
    
    // 从本地存储加载数据
    loadData() {
        const saved = localStorage.getItem('knowledgeBaseData');
        if (saved) {
            const loadedData = JSON.parse(saved);
            // 合并数据，确保必要的属性存在
            this.data = {
                ...this.data, // 保留构造函数中的默认值
                ...loadedData, // 覆盖保存的数据
                // 确保这些属性始终存在
                imageCategories: loadedData.imageCategories || this.data.imageCategories,
                imageTags: loadedData.imageTags || this.data.imageTags,
                imageNoteAssociations: loadedData.imageNoteAssociations || this.data.imageNoteAssociations,
                linkFolders: loadedData.linkFolders || this.data.linkFolders,
                folderAccessStates: loadedData.folderAccessStates || this.data.folderAccessStates
            };
            
            // 为旧数据添加文件夹ID字段
            this.data.links.forEach(link => {
                if (!link.folderId) {
                    link.folderId = 'default';
                }
            });
            
            // 更新文件夹链接数量
            this.updateFolderLinkCounts();
        }
    }
    
    // 更新文件夹链接数量
    updateFolderLinkCounts() {
        this.data.linkFolders.forEach(folder => {
            folder.linkCount = this.data.links.filter(link => link.folderId === folder.id).length;
        });
    }
    
    // 导出数据
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `知识库数据_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
    
    // 导入数据
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            // 验证文件大小
            if (file.size > 10 * 1024 * 1024) { // 10MB限制
                this.showToast('错误', '导入文件过大，请选择小于10MB的文件', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // 验证导入数据的结构
                    if (!this.validateImportedData(importedData)) {
                        this.showToast('错误', '导入文件格式不正确或数据已损坏', 'error');
                        return;
                    }
                    
                    // 清理和验证数据
                    const sanitizedData = this.sanitizeImportedData(importedData);
                    
                    this.data = sanitizedData;
                    this.saveData();
                    this.updateStats();
                    this.refreshCurrentSection();
                    this.showRecentItems();
                    this.showToast('成功', '数据导入成功！', 'success');
                } catch (error) {
                    this.showToast('错误', '导入失败：文件格式不正确', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
    
    // 验证导入的数据结构
    validateImportedData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }
        
        // 检查必要的数组属性
        const requiredArrays = ['documents', 'images', 'videos', 'links', 'notes'];
        for (const key of requiredArrays) {
            if (!Array.isArray(data[key])) {
                return false;
            }
        }
        
        return true;
    }
    
    // 清理导入的数据
    sanitizeImportedData(data) {
        const sanitized = { ...data };
        
        // 清理所有文本字段
        ['documents', 'images', 'videos', 'links', 'notes'].forEach(category => {
            if (Array.isArray(sanitized[category])) {
                sanitized[category] = sanitized[category].map(item => {
                    if (item && typeof item === 'object') {
                        const cleanItem = { ...item };
                        
                        // 清理文本字段
                        ['name', 'title', 'description', 'content'].forEach(field => {
                            if (cleanItem[field] && typeof cleanItem[field] === 'string') {
                                cleanItem[field] = this.sanitizeInput(cleanItem[field]);
                            }
                        });
                        
                        // 清理标签
                        if (Array.isArray(cleanItem.tags)) {
                            cleanItem.tags = cleanItem.tags
                                .filter(tag => typeof tag === 'string')
                                .map(tag => this.sanitizeInput(tag))
                                .filter(tag => tag.length > 0 && tag.length <= 50);
                        }
                        
                        return cleanItem;
                    }
                    return item;
                }).filter(item => item && typeof item === 'object');
            }
        });
        
        return sanitized;
    }
    
    // 更新模态框文件预览列表
    updateModalFilePreviewList() {
        const modalFileList = document.getElementById('modalFileList');
        const modalFileCount = document.getElementById('modalFileCount');
        
        modalFileCount.textContent = `${this.modalPendingFiles.length} 个文件`;
        modalFileList.innerHTML = '';
        
        this.modalPendingFiles.forEach(fileItem => {
            const previewItem = this.createModalFilePreviewItem(fileItem);
            modalFileList.appendChild(previewItem);
        });
    }
    
    // 创建模态框文件预览项
    createModalFilePreviewItem(fileItem) {
        const item = document.createElement('div');
        item.className = 'modal-file-item';
        item.dataset.fileId = fileItem.id;
        
        const fileType = this.getDocumentType(fileItem.name, fileItem.type);
        
        item.innerHTML = `
            <div class="modal-file-thumbnail ${fileType.type}">
                ${fileItem.thumbnail ? 
                    `<img src="${fileItem.thumbnail}" alt="${fileItem.name}">` : 
                    `<i class="${fileType.icon}"></i>`
                }
            </div>
            <div class="modal-file-info">
                <div class="modal-file-name">${fileItem.name}</div>
                <div class="modal-file-meta">
                    <div class="modal-file-size">
                        <i class="fas fa-weight-hanging"></i>
                        <span>${this.formatFileSize(fileItem.size)}</span>
                    </div>
                    <div class="modal-file-type">
                        <i class="${fileType.icon}"></i>
                        <span>${fileType.label}</span>
                    </div>
                </div>
            </div>
            <button class="modal-remove-file" title="移除文件">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const removeBtn = item.querySelector('.modal-remove-file');
        removeBtn.addEventListener('click', () => {
            this.removeFromModalPendingFiles(fileItem.id);
        });
        
        return item;
    }
    
    // 从模态框待上传列表中移除文件
    removeFromModalPendingFiles(fileId) {
        this.modalPendingFiles = this.modalPendingFiles.filter(f => f.id !== fileId);
        this.updateModalFilePreviewList();
        
        if (this.modalPendingFiles.length === 0) {
            this.hideModalFilePreview();
        }
    }
    
    // 清空模态框待上传文件
    clearModalPendingFiles() {
        this.modalPendingFiles = [];
        this.updateModalFilePreviewList();
        this.hideModalFilePreview();
    }
    
    // 显示模态框文件预览区域
    showModalFilePreview() {
        const modalFilePreview = document.getElementById('modalFilePreview');
        modalFilePreview.classList.add('active');
    }
    
    // 隐藏模态框文件预览区域
    hideModalFilePreview() {
        const modalFilePreview = document.getElementById('modalFilePreview');
        modalFilePreview.classList.remove('active');
    }
    
    // 处理模态框文件上传
    async processModalFileUpload() {
        if (this.modalPendingFiles.length === 0) {
            this.showError('上传失败', '请选择要上传的文件');
            return;
        }
        
        try {
            this.hideError();
            this.showButtonLoading('confirmAdd', '上传中...');
            this.showUploadProgress();
            
            const totalFiles = this.modalPendingFiles.length;
            let processedFiles = 0;
            
            // 上传文件
            for (const fileItem of this.modalPendingFiles) {
                await this.uploadModalFile(fileItem);
                processedFiles++;
                
                // 更新进度
                const progress = (processedFiles / totalFiles) * 100;
                this.updateUploadProgress(progress);
                
                // 模拟上传时间
                await this.simulateAsyncOperation(300);
            }
            
            // 显示成功消息
            this.showToast('上传成功', `成功上传 ${totalFiles} 个文件`, 'success');
            
            // 上传完成后清空列表并关闭模态框
            setTimeout(() => {
                this.clearModalPendingFiles();
                this.closeModal();
            }, 1000);
            
        } catch (error) {
            this.showError('上传失败', error.message || '文件上传过程中出现错误，请稍后重试');
        } finally {
            this.hideButtonLoading('confirmAdd');
            this.hideUploadProgress();
        }
    }
    
    // 上传模态框单个文件
    async uploadModalFile(fileItem) {
        return new Promise((resolve, reject) => {
            const file = fileItem.file;
            
            // 文件大小检查
            if (file.size > this.security.maxFileSize) {
                reject(new Error(`文件 "${file.name}" 超过大小限制（50MB）`));
                return;
            }
            
            const item = {
                id: this.generateId(),
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toISOString(),
                tags: this.autoGenerateTags(file)
            };
            
            // 根据文件类型分类处理
            if (file.type.startsWith('image/')) {
                this.processModalImageFile(file, item).then(resolve).catch(reject);
            } else if (file.type.startsWith('video/')) {
                this.processModalVideoFile(file, item).then(resolve).catch(reject);
            } else {
                this.processModalDocumentFile(file, item).then(resolve).catch(reject);
            }
        });
    }
    
    // 处理模态框图片文件
    processModalImageFile(file, item) {
        return new Promise(async (resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        // 保存原图
                        const originalDataUrl = e.target.result;
                        
                        // 生成压缩图
                        const compressedDataUrl = await this.compressImage(file);
                        
                        // 获取图片元数据
                        const metadata = await this.getImageMetadata(file);
                        
                        // 获取智能标签推荐
                        const suggestedTags = this.suggestImageTags(file.name, item.tags || []);
                        
                        // 更新图片数据结构
                        const imageItem = {
                            ...item,
                            category: 'images',
                            // 保存原图和压缩图
                            originalDataUrl: originalDataUrl,
                            dataUrl: compressedDataUrl, // 默认显示压缩图
                            compressed: originalDataUrl !== compressedDataUrl,
                            // 图片元数据
                            metadata: metadata,
                            // 扩展数据结构
                            imageCategory: this.currentImageCategory || 'general',
                            description: '', // 图片描述
                            suggestedTags: suggestedTags,
                            // 关联笔记
                            associatedNotes: [],
                            // 其他元数据
                            location: null, // GPS信息（如果有）
                            camera: null, // 相机信息（如果有）
                            tags: [...(item.tags || []), ...suggestedTags.slice(0, 3)] // 自动添加前3个推荐标签
                        };
                        
                        // 更新标签数据
                        imageItem.tags.forEach(tagName => {
                            this.getOrCreateTag(tagName);
                        });
                        
                        this.data.images.push(imageItem);
                        this.updateTagUsage();
                        this.saveAndRefresh();
                        resolve(imageItem);
                    } catch (error) {
                        reject(new Error(`图片处理失败: ${error.message}`));
                    }
                };
                reader.onerror = () => {
                    reject(new Error(`图片文件 "${file.name}" 读取失败`));
                };
                reader.readAsDataURL(file);
            } catch (error) {
                reject(new Error(`图片处理失败: ${error.message}`));
            }
        });
    }
    
    // 处理模态框视频文件
    processModalVideoFile(file, item) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                item.dataUrl = e.target.result;
                item.category = 'videos';
                this.data.videos.push(item);
                this.saveAndRefresh();
                resolve(item);
            };
            reader.onerror = () => {
                reject(new Error(`视频文件 "${file.name}" 读取失败`));
            };
            reader.readAsDataURL(file);
        });
    }
    
    // 处理模态框文档文件
    processModalDocumentFile(file, item) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (file.type === 'text/plain') {
                    item.content = e.target.result;
                } else {
                    item.dataUrl = e.target.result;
                }
                item.category = 'documents';
                this.data.documents.push(item);
                this.saveAndRefresh();
                resolve(item);
            };
            reader.onerror = () => {
                reject(new Error(`文档文件 "${file.name}" 读取失败`));
            };
            
            if (file.type === 'text/plain') {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 保存数据并刷新界面
    saveAndRefresh() {
        this.saveData();
        this.updateStats();
        this.showRecentItems();
        this.refreshCurrentSection();
    }
    
    // 设置富文本编辑器
    setupRichTextEditor() {
        const editorContent = document.getElementById('noteContent');
        const toolbar = document.querySelector('.editor-toolbar');
        
        if (!editorContent || !toolbar) return;
        
        // 工具栏按钮事件
        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.toolbar-btn');
            if (!button) return;
            
            e.preventDefault();
            const command = button.dataset.command;
            
            // 确保编辑器获得焦点
            editorContent.focus();
            
            // 执行富文本命令
            this.execCommand(command, button);
        });
        
        // 格式选择下拉框事件
        const formatSelect = toolbar.querySelector('.format-select');
        if (formatSelect) {
            formatSelect.addEventListener('change', (e) => {
                editorContent.focus();
                document.execCommand('formatBlock', false, e.target.value);
                this.updateToolbarState();
            });
        }
        
        // 图片上传事件
        const imageUpload = document.getElementById('imageUpload');
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files[0]);
            });
        }
        
        // 编辑器内容变化时更新工具栏状态
        editorContent.addEventListener('keyup', () => this.updateToolbarState());
        editorContent.addEventListener('mouseup', () => this.updateToolbarState());
        
        // 处理回车键创建新段落
        editorContent.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                // 让浏览器默认处理，但确保使用div而不是br
                setTimeout(() => {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        if (range.commonAncestorContainer === editorContent) {
                            document.execCommand('formatBlock', false, 'div');
                        }
                    }
                }, 0);
            }
        });
    }
    
    // 执行富文本编辑命令
    execCommand(command, button) {
        switch (command) {
            case 'createLink':
                const url = prompt('请输入链接地址:', 'https://');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
                break;
                
            case 'insertImage':
                document.getElementById('imageUpload').click();
                break;
                
            default:
                document.execCommand(command, false, null);
                break;
        }
        
        this.updateToolbarState();
    }
    
    // 更新工具栏按钮状态
    updateToolbarState() {
        const buttons = document.querySelectorAll('.toolbar-btn');
        
        buttons.forEach(button => {
            const command = button.dataset.command;
            if (command && ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'].includes(command)) {
                if (document.queryCommandState(command)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });
    }
    
    // 处理图片上传
    handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('请选择有效的图片文件');
            return;
        }
        
        if (file.size > this.security.maxFileSize) {
            this.showToast('错误', '图片文件大小不能超过50MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            // 在当前光标位置插入图片
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(img);
                
                // 将光标移到图片后面
                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        };
        reader.readAsDataURL(file);
    }
    
    // 获取富文本编辑器内容
    getRichTextContent() {
        const editorContent = document.getElementById('noteContent');
        return editorContent ? editorContent.innerHTML : '';
    }
    
    // 设置富文本编辑器内容
    setRichTextContent(content) {
        const editorContent = document.getElementById('noteContent');
        if (editorContent) {
            editorContent.innerHTML = content || '';
        }
    }
    
    // 清空富文本编辑器
    clearRichTextEditor() {
        this.setRichTextContent('');
    }
    
    // 设置标签智能联想
    setupTagSuggestions() {
        const tagInput = document.getElementById('noteTags');
        const suggestionsContainer = document.getElementById('tagSuggestions');
        
        if (!tagInput || !suggestionsContainer) return;
        
        let selectedIndex = -1;
        
        // 输入事件
        tagInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const lastComma = value.lastIndexOf(',');
            const currentTag = lastComma >= 0 ? value.substring(lastComma + 1).trim() : value.trim();
            
            if (currentTag.length >= 1) {
                this.showTagSuggestions(currentTag, suggestionsContainer);
                selectedIndex = -1;
            } else {
                this.hideTagSuggestions(suggestionsContainer);
            }
        });
        
        // 键盘事件
        tagInput.addEventListener('keydown', (e) => {
            const suggestions = suggestionsContainer.querySelectorAll('.tag-suggestion-item');
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
                    this.updateSuggestionSelection(suggestions, selectedIndex);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    selectedIndex = Math.max(selectedIndex - 1, -1);
                    this.updateSuggestionSelection(suggestions, selectedIndex);
                    break;
                    
                case 'Enter':
                case 'Tab':
                    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                        e.preventDefault();
                        this.selectTag(suggestions[selectedIndex].textContent.trim(), tagInput);
                        this.hideTagSuggestions(suggestionsContainer);
                        selectedIndex = -1;
                    }
                    break;
                    
                case 'Escape':
                    this.hideTagSuggestions(suggestionsContainer);
                    selectedIndex = -1;
                    break;
            }
        });
        
        // 失去焦点时隐藏建议
        tagInput.addEventListener('blur', (e) => {
            // 延迟隐藏，以便点击建议项
            setTimeout(() => {
                this.hideTagSuggestions(suggestionsContainer);
                selectedIndex = -1;
            }, 200);
        });
    }
    
    // 显示标签建议
    showTagSuggestions(query, container) {
        const allTags = this.getAllHistoryTags();
        const filteredTags = allTags.filter(tag => 
            tag.name.toLowerCase().includes(query.toLowerCase())
        ).sort((a, b) => b.count - a.count).slice(0, 8);
        
        const popularTags = this.getPopularTags().slice(0, 6);
        
        container.innerHTML = '';
        
        if (filteredTags.length > 0 || popularTags.length > 0) {
            if (query.length > 0 && filteredTags.length > 0) {
                filteredTags.forEach(tag => {
                    const item = document.createElement('div');
                    item.className = 'tag-suggestion-item';
                    item.innerHTML = `
                        <span class="tag-suggestion-text">${tag.name}</span>
                        <span class="tag-suggestion-count">${tag.count}</span>
                    `;
                    item.addEventListener('click', () => {
                        this.selectTag(tag.name, document.getElementById('noteTags'));
                        this.hideTagSuggestions(container);
                    });
                    container.appendChild(item);
                });
            }
            
            if (popularTags.length > 0) {
                const popularSection = document.createElement('div');
                popularSection.className = 'popular-tags';
                popularSection.innerHTML = `
                    <div>常用标签</div>
                    <div class="popular-tags-list">
                        ${popularTags.map(tag => `
                            <span class="popular-tag" data-tag="${tag}">${tag}</span>
                        `).join('')}
                    </div>
                `;
                
                popularSection.addEventListener('click', (e) => {
                    if (e.target.classList.contains('popular-tag')) {
                        this.selectTag(e.target.dataset.tag, document.getElementById('noteTags'));
                        this.hideTagSuggestions(container);
                    }
                });
                
                container.appendChild(popularSection);
            }
            
            container.classList.add('active');
        } else {
            this.hideTagSuggestions(container);
        }
    }
    
    // 隐藏标签建议
    hideTagSuggestions(container) {
        container.classList.remove('active');
        container.innerHTML = '';
    }
    
    // 更新建议选择状态
    updateSuggestionSelection(suggestions, selectedIndex) {
        suggestions.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    // 选择标签
    selectTag(tagName, input) {
        const value = input.value;
        const lastComma = value.lastIndexOf(',');
        
        let newValue;
        if (lastComma >= 0) {
            newValue = value.substring(0, lastComma + 1) + ' ' + tagName + ', ';
        } else {
            newValue = tagName + ', ';
        }
        
        input.value = newValue;
        input.focus();
    }
    
    // 获取所有历史标签
    getAllHistoryTags() {
        const tagCount = {};
        
        // 统计所有笔记中的标签
        this.data.notes.forEach(note => {
            if (note.tags && Array.isArray(note.tags)) {
                note.tags.forEach(tag => {
                    tagCount[tag] = (tagCount[tag] || 0) + 1;
                });
            }
        });
        
        // 转换为数组格式
        return Object.entries(tagCount).map(([name, count]) => ({ name, count }));
    }
    
    // 获取常用标签
    getPopularTags() {
        return ['学习', '工作', '技术', '生活', '想法', '总结', '笔记', '重要'];
    }
    
    // 交互优化功能
    
    // 显示Loading状态
    showButtonLoading(buttonId, loadingText = '处理中...') {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        button.classList.add('loading');
        const loadingTextElement = button.querySelector('.loading-text');
        if (loadingTextElement) {
            loadingTextElement.textContent = loadingText;
        }
    }
    
    // 隐藏Loading状态
    hideButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        button.classList.remove('loading');
    }
    
    // 显示错误提示
    showError(title, message, container = 'errorMessageContainer') {
        const errorContainer = document.getElementById(container);
        if (!errorContainer) return;
        
        const errorHtml = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="error-message-content">
                    <div class="error-message-title">${title}</div>
                    <div class="error-message-text">${message}</div>
                </div>
            </div>
        `;
        
        errorContainer.innerHTML = errorHtml;
        errorContainer.classList.add('show');
        
        // 自动隐藏错误提示
        setTimeout(() => {
            this.hideError(container);
        }, 5000);
    }
    
    // 隐藏错误提示
    hideError(container = 'errorMessageContainer') {
        const errorContainer = document.getElementById(container);
        if (!errorContainer) return;
        
        errorContainer.classList.remove('show');
        setTimeout(() => {
            errorContainer.innerHTML = '';
        }, 300);
    }
    
    // 显示上传进度
    showUploadProgress() {
        const progressContainer = document.getElementById('uploadProgressContainer');
        if (progressContainer) {
            progressContainer.style.display = 'block';
            this.updateUploadProgress(0);
        }
    }
    
    // 更新上传进度
    updateUploadProgress(percentage) {
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = document.getElementById('progressPercentage');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = `${Math.round(percentage)}%`;
        }
    }
    
    // 隐藏上传进度
    hideUploadProgress() {
        const progressContainer = document.getElementById('uploadProgressContainer');
        if (progressContainer) {
            setTimeout(() => {
                progressContainer.style.display = 'none';
            }, 500);
        }
    }
    
    // 显示Toast通知
    showToast(title, message, type = 'info', duration = 4000) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toastId = 'toast-' + Date.now();
        const iconMap = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        
        const toastHtml = `
            <div class="toast ${type}" id="${toastId}">
                <i class="toast-icon fas ${iconMap[type] || iconMap.info}"></i>
                <div class="toast-content">
                    <div class="toast-title">${title}</div>
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close" onclick="window.knowledgeBase.removeToast('${toastId}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        toastContainer.insertAdjacentHTML('beforeend', toastHtml);
        
        const toast = document.getElementById(toastId);
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // 自动移除
        setTimeout(() => {
            this.removeToast(toastId);
        }, duration);
    }
    
    // 移除Toast通知
    removeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }
    
    // 模拟延迟操作（用于演示）
    async simulateAsyncOperation(duration = 2000) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        });
    }
    
    // 验证表单数据
    validateFormData(type) {
        switch (type) {
            case 'note':
                const title = document.getElementById('noteTitle').value.trim();
                const content = this.getRichTextContent().trim();
                
                if (!title) {
                    throw new Error('请输入笔记标题');
                }
                
                if (!content || content === '<div><br></div>' || content === '<br>') {
                    throw new Error('请输入笔记内容');
                }
                
                if (title.length > 100) {
                    throw new Error('标题长度不能超过100个字符');
                }
                
                return { title, content };
                
            case 'link':
                const url = document.getElementById('linkUrl').value.trim();
                const linkTitle = document.getElementById('linkTitle').value.trim();
                
                if (!url) {
                    throw new Error('请输入链接地址');
                }
                
                // 简单的URL验证
                try {
                    new URL(url);
                } catch {
                    throw new Error('请输入有效的链接地址');
                }
                
                return { url, title: linkTitle || url };
                
            default:
                return {};
        }
    }
    
    // 编辑功能相关方法
    
    // 编辑项目
    editItem(itemId, category) {
        const item = this.findItemById(itemId, category);
        if (!item) {
            this.showToast('错误', '未找到要编辑的项目', 'error');
            return;
        }
        
        this.showEditModal(item, category);
    }
    
    // 显示编辑模态框
    showEditModal(item, category) {
        const modal = document.getElementById('editContentModal');
        const title = document.getElementById('editModalTitle');
        
        // 设置模态框标题
        const titleMap = {
            'notes': '编辑笔记',
            'links': '编辑链接',
            'documents': '编辑文档',
            'images': '编辑图片',
            'videos': '编辑视频'
        };
        title.textContent = titleMap[category] || '编辑内容';
        
        // 隐藏所有编辑表单
        document.querySelectorAll('.edit-form').forEach(form => {
            form.style.display = 'none';
        });
        
        // 显示对应的编辑表单
        let formId;
        switch (category) {
            case 'notes':
                formId = 'editNoteForm';
                break;
            case 'links':
                formId = 'editLinkForm';
                break;
            case 'documents':
                formId = 'editDocumentForm';
                break;
            case 'images':
                formId = 'editImageForm';
                break;
            case 'videos':
                formId = 'editVideoForm';
                break;
            default:
                formId = null;
        }
        
        if (formId) {
            const form = document.getElementById(formId);
            if (form) {
                form.style.display = 'block';
            } else {
                console.error(`编辑表单未找到: ${formId}`);
            }
        }
        
        // 填充表单数据
        this.populateEditForm(item, category);
        
        // 存储当前编辑的项目信息
        this.currentEditItem = { item, category };
        
        // 显示模态框
        modal.classList.add('active');
    }
    
    // 填充编辑表单
    populateEditForm(item, category) {
        switch (category) {
            case 'notes':
                document.getElementById('editNoteTitle').value = item.title || '';
                this.setEditRichTextContent(item.content || '');
                document.getElementById('editNoteTags').value = (item.tags || []).join(', ');
                break;
                
            case 'links':
                document.getElementById('editLinkUrl').value = item.url || '';
                document.getElementById('editLinkTitle').value = item.title || '';
                document.getElementById('editLinkDescription').value = item.description || '';
                document.getElementById('editLinkTags').value = (item.tags || []).join(', ');
                
                // 动态生成文件夹选项
                this.populateFolderSelector('editLinkFolder', item.folderId || 'default');
                break;
                
            case 'documents':
                document.getElementById('editDocumentName').value = item.name || '';
                document.getElementById('editDocumentTags').value = (item.tags || []).join(', ');
                break;
                
            case 'images':
                document.getElementById('editImageName').value = item.name || '';
                document.getElementById('editImageTags').value = (item.tags || []).join(', ');
                break;
                
            case 'videos':
                document.getElementById('editVideoName').value = item.name || '';
                document.getElementById('editVideoTags').value = (item.tags || []).join(', ');
                break;
        }
    }
    
    // 填充文件夹选择器
    populateFolderSelector(selectId, selectedFolderId = 'default') {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // 清空现有选项
        select.innerHTML = '';
        
        // 添加文件夹选项
        this.data.linkFolders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder.id;
            option.textContent = `${folder.name}${folder.isEncrypted ? ' 🔒' : ''}`;
            
            // 设置选中状态
            if (folder.id === selectedFolderId) {
                option.selected = true;
            }
            
            select.appendChild(option);
        });
    }
    
    // 保存编辑
    async saveEdit() {
        if (!this.currentEditItem) return;
        
        this.hideError('editErrorMessageContainer');
        
        try {
            const { item, category } = this.currentEditItem;
            
            // 显示loading状态
            this.showButtonLoading('confirmEdit', '保存中...');
            
            // 模拟异步操作
            await this.simulateAsyncOperation(800);
            
            // 获取编辑后的数据
            const updatedData = this.getEditFormData(category);
            
            // 更新项目数据
            Object.assign(item, updatedData);
            
            // 保存到本地存储
            this.saveAndRefresh();
            
            // 显示成功提示
            this.showToast('保存成功', '内容已成功更新', 'success');
            
            // 关闭模态框
            this.closeEditModal();
            
        } catch (error) {
            this.showError('保存失败', error.message, 'editErrorMessageContainer');
        } finally {
            this.hideButtonLoading('confirmEdit');
        }
    }
    
    // 获取编辑表单数据
    getEditFormData(category) {
        switch (category) {
            case 'notes':
                const title = document.getElementById('editNoteTitle').value.trim();
                const content = this.getEditRichTextContent().trim();
                const tags = document.getElementById('editNoteTags').value;
                
                if (!title) throw new Error('请输入笔记标题');
                if (!content || content === '<div><br></div>' || content === '<br>') {
                    throw new Error('请输入笔记内容');
                }
                
                return {
                    title,
                    content,
                    tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                };
                
            case 'links':
                const url = document.getElementById('editLinkUrl').value.trim();
                const linkTitle = document.getElementById('editLinkTitle').value.trim();
                const description = document.getElementById('editLinkDescription').value.trim();
                const linkTags = document.getElementById('editLinkTags').value;
                const folderId = document.getElementById('editLinkFolder').value;
                
                if (!url) throw new Error('请输入链接地址');
                
                try {
                    new URL(url);
                } catch {
                    throw new Error('请输入有效的链接地址');
                }
                
                return {
                    url,
                    title: linkTitle || url,
                    description,
                    folderId,
                    tags: linkTags.split(',').map(tag => tag.trim()).filter(tag => tag)
                };
                
            case 'documents':
                const docName = document.getElementById('editDocumentName').value.trim();
                const docTags = document.getElementById('editDocumentTags').value;
                
                if (!docName) throw new Error('请输入文档名称');
                
                return {
                    name: docName,
                    tags: docTags.split(',').map(tag => tag.trim()).filter(tag => tag)
                };
                
            case 'images':
                const imgName = document.getElementById('editImageName').value.trim();
                const imgTags = document.getElementById('editImageTags').value;
                
                if (!imgName) throw new Error('请输入图片名称');
                
                return {
                    name: imgName,
                    tags: imgTags.split(',').map(tag => tag.trim()).filter(tag => tag)
                };
                
            case 'videos':
                const videoName = document.getElementById('editVideoName').value.trim();
                const videoTags = document.getElementById('editVideoTags').value;
                
                if (!videoName) throw new Error('请输入视频名称');
                
                return {
                    name: videoName,
                    tags: videoTags.split(',').map(tag => tag.trim()).filter(tag => tag)
                };
                
            default:
                return {};
        }
    }
    
    // 关闭编辑模态框
    closeEditModal() {
        const modal = document.getElementById('editContentModal');
        modal.classList.remove('active');
        this.currentEditItem = null;
        this.hideError('editErrorMessageContainer');
    }
    
    // 删除功能相关方法
    
    // 删除项目
    deleteItem(itemId, category) {
        const item = this.findItemById(itemId, category);
        if (!item) {
            this.showToast('错误', '未找到要删除的项目', 'error');
            return;
        }
        
        this.showDeleteConfirmModal(item, category);
    }
    
    // 显示删除确认模态框
    showDeleteConfirmModal(item, category) {
        const modal = document.getElementById('deleteConfirmModal');
        const title = document.getElementById('deleteConfirmTitle');
        const message = document.getElementById('deleteConfirmMessage');
        
        // 设置确认文本
        const itemName = item.title || item.name || '未命名项目';
        const typeMap = {
            'notes': '笔记',
            'links': '链接',
            'documents': '文档',
            'images': '图片',
            'videos': '视频'
        };
        
        title.textContent = `确认删除此${typeMap[category] || '项目'}？`;
        message.innerHTML = `
            您即将删除：<strong>"${itemName}"</strong><br>
            此操作不可撤销，删除后将无法恢复。
        `;
        
        // 存储当前删除的项目信息
        this.currentDeleteItem = { item, category };
        
        // 显示模态框
        modal.classList.add('active');
    }
    
    // 确认删除
    async confirmDelete() {
        if (!this.currentDeleteItem) return;
        
        try {
            const { item, category } = this.currentDeleteItem;
            
            // 显示loading状态
            this.showButtonLoading('confirmDelete', '删除中...');
            
            // 模拟异步操作
            await this.simulateAsyncOperation(600);
            
            // 从数据中删除
            const dataArray = this.data[category];
            const index = dataArray.findIndex(dataItem => dataItem.id === item.id);
            if (index !== -1) {
                dataArray.splice(index, 1);
            }
            
            // 保存到本地存储
            this.saveAndRefresh();
            
            // 显示成功提示
            this.showToast('删除成功', '项目已成功删除', 'success');
            
            // 关闭模态框
            this.closeDeleteConfirmModal();
            
        } catch (error) {
            this.showToast('删除失败', error.message, 'error');
        } finally {
            this.hideButtonLoading('confirmDelete');
        }
    }
    
    // 关闭删除确认模态框
    closeDeleteConfirmModal() {
        const modal = document.getElementById('deleteConfirmModal');
        modal.classList.remove('active');
        this.currentDeleteItem = null;
    }
    
    // 工具方法
    
    // 根据ID查找项目
    findItemById(itemId, category) {
        const dataArray = this.data[category];
        return dataArray ? dataArray.find(item => item.id === itemId) : null;
    }
    
    // 设置编辑富文本编辑器内容
    setEditRichTextContent(content) {
        const editorContent = document.getElementById('editNoteContent');
        if (editorContent) {
            editorContent.innerHTML = content || '';
        }
    }
    
    // 获取编辑富文本编辑器内容
    getEditRichTextContent() {
        const editorContent = document.getElementById('editNoteContent');
        return editorContent ? editorContent.innerHTML : '';
    }
    
    // 设置编辑模态框的富文本编辑器
    setupEditRichTextEditor() {
        const editorContent = document.getElementById('editNoteContent');
        const editModal = document.getElementById('editContentModal');
        
        if (!editorContent || !editModal) return;
        
        // 获取编辑模态框内的工具栏
        const toolbar = editModal.querySelector('.editor-toolbar');
        
        if (!toolbar) return;
        
        // 工具栏按钮事件
        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.toolbar-btn');
            if (!button) return;
            
            e.preventDefault();
            const command = button.dataset.command;
            
            // 确保编辑器获得焦点
            editorContent.focus();
            
            // 执行富文本命令
            this.execEditCommand(command, button, editorContent);
        });
        
        // 格式选择下拉框事件
        const formatSelect = toolbar.querySelector('.format-select');
        if (formatSelect) {
            formatSelect.addEventListener('change', (e) => {
                editorContent.focus();
                document.execCommand('formatBlock', false, e.target.value);
                this.updateEditToolbarState(toolbar);
            });
        }
        
        // 图片上传事件
        const imageUpload = document.getElementById('editImageUpload');
        if (imageUpload) {
            imageUpload.addEventListener('change', (e) => {
                this.handleEditImageUpload(e.target.files[0], editorContent);
            });
        }
        
        // 编辑器内容变化时更新工具栏状态
        editorContent.addEventListener('keyup', () => this.updateEditToolbarState(toolbar));
        editorContent.addEventListener('mouseup', () => this.updateEditToolbarState(toolbar));
        
        // 处理回车键创建新段落
        editorContent.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                // 让浏览器默认处理，但确保使用div而不是br
                setTimeout(() => {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0);
                        if (range.commonAncestorContainer === editorContent) {
                            document.execCommand('formatBlock', false, 'div');
                        }
                    }
                }, 0);
            }
        });
    }
    
    // 执行编辑富文本命令
    execEditCommand(command, button, editorContent) {
        switch (command) {
            case 'createLink':
                const url = prompt('请输入链接地址:', 'https://');
                if (url) {
                    document.execCommand('createLink', false, url);
                }
                break;
                
            case 'insertImage':
                document.getElementById('editImageUpload').click();
                break;
                
            default:
                document.execCommand(command, false, null);
                break;
        }
        
        this.updateEditToolbarState(button.closest('.editor-toolbar'));
    }
    
    // 更新编辑工具栏按钮状态
    updateEditToolbarState(toolbar) {
        const buttons = toolbar.querySelectorAll('.toolbar-btn');
        
        buttons.forEach(button => {
            const command = button.dataset.command;
            if (command && ['bold', 'italic', 'underline', 'insertUnorderedList', 'insertOrderedList'].includes(command)) {
                if (document.queryCommandState(command)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        });
    }
    
    // 处理编辑图片上传
    handleEditImageUpload(file, editorContent) {
        if (!file || !file.type.startsWith('image/')) {
            this.showToast('错误', '请选择有效的图片文件', 'error');
            return;
        }
        
        if (file.size > this.security.maxFileSize) {
            this.showToast('错误', '图片文件大小不能超过50MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            // 在当前光标位置插入图片
            editorContent.focus();
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(img);
                
                // 将光标移到图片后面
                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        };
        reader.readAsDataURL(file);
    }
    
    // 新增：显示笔记关联对话框
    showNoteAssociationDialog() {
        if (!this.currentEditingImage) return;
        
        // 创建笔记选择对话框
        const dialogHtml = `
            <div class="note-association-dialog" id="noteAssociationDialog">
                <div class="dialog-overlay"></div>
                <div class="dialog-content">
                    <div class="dialog-header">
                        <h3><i class="fas fa-link"></i> 关联笔记</h3>
                        <button class="dialog-close" type="button">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="dialog-body">
                        <div class="note-search-section">
                            <label for="noteSearchInput">搜索笔记：</label>
                            <div class="search-input-wrapper">
                                <i class="fas fa-search"></i>
                                <input type="text" id="noteSearchInput" placeholder="输入关键词搜索笔记...">
                            </div>
                        </div>
                        
                        <div class="note-list-section">
                            <h4>可关联的笔记：</h4>
                            <div class="available-notes" id="availableNotes">
                                <!-- 笔记列表会动态生成 -->
                            </div>
                        </div>
                        
                        <div class="associated-notes-section">
                            <h4>已关联的笔记：</h4>
                            <div class="associated-notes" id="associatedNotes">
                                <!-- 已关联笔记会动态生成 -->
                            </div>
                        </div>
                        
                        <div class="quick-note-section">
                            <h4>快速创建笔记：</h4>
                            <div class="quick-note-form">
                                <input type="text" id="quickNoteTitle" placeholder="笔记标题...">
                                <textarea id="quickNoteContent" placeholder="笔记内容..." rows="3"></textarea>
                                <button type="button" id="createQuickNote" class="btn-secondary">
                                    <i class="fas fa-plus"></i> 创建并关联
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dialog-footer">
                        <button type="button" id="saveNoteAssociations" class="btn-primary">
                            <i class="fas fa-save"></i> 保存关联
                        </button>
                        <button type="button" class="dialog-cancel btn-secondary">
                            <i class="fas fa-times"></i> 取消
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // 添加到页面
        const existingDialog = document.getElementById('noteAssociationDialog');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', dialogHtml);
        
        // 设置事件监听器
        this.setupNoteAssociationEvents();
        
        // 显示对话框
        const dialog = document.getElementById('noteAssociationDialog');
        dialog.style.display = 'flex';
        
        // 加载笔记数据
        this.loadNotesForAssociation();
        
        // 显示当前已关联的笔记
        this.displayCurrentAssociations();
    }
    
    // 新增：设置笔记关联对话框事件
    setupNoteAssociationEvents() {
        const dialog = document.getElementById('noteAssociationDialog');
        
        // 关闭对话框
        const closeButtons = dialog.querySelectorAll('.dialog-close, .dialog-cancel');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideNoteAssociationDialog();
            });
        });
        
        // 点击遮罩关闭
        dialog.querySelector('.dialog-overlay').addEventListener('click', () => {
            this.hideNoteAssociationDialog();
        });
        
        // 笔记搜索
        const searchInput = dialog.querySelector('#noteSearchInput');
        searchInput.addEventListener('input', (e) => {
            this.filterNotesForAssociation(e.target.value);
        });
        
        // 保存关联
        const saveBtn = dialog.querySelector('#saveNoteAssociations');
        saveBtn.addEventListener('click', () => {
            this.saveNoteAssociations();
        });
        
        // 快速创建笔记
        const createBtn = dialog.querySelector('#createQuickNote');
        createBtn.addEventListener('click', () => {
            this.createQuickNote();
        });
    }
    
    // 新增：隐藏笔记关联对话框
    hideNoteAssociationDialog() {
        const dialog = document.getElementById('noteAssociationDialog');
        if (dialog) {
            dialog.remove();
        }
    }
    
    // 新增：加载可关联的笔记
    loadNotesForAssociation() {
        const availableNotesContainer = document.getElementById('availableNotes');
        
        if (this.data.notes.length === 0) {
            availableNotesContainer.innerHTML = `
                <div class="no-notes-message">
                    <i class="fas fa-sticky-note"></i>
                    <p>暂无可关联的笔记</p>
                    <p class="text-muted">可以使用下方的快速创建功能</p>
                </div>
            `;
            return;
        }
        
        const notesHtml = this.data.notes.map(note => {
            const isAssociated = this.isNoteAssociatedWithImage(note.id, this.currentEditingImage.id);
            return `
                <div class="note-item ${isAssociated ? 'associated' : ''}" data-note-id="${note.id}">
                    <div class="note-item-header">
                        <h5>${this.escapeHtml(note.title)}</h5>
                        <button class="note-toggle-btn ${isAssociated ? 'remove' : 'add'}" 
                                title="${isAssociated ? '取消关联' : '添加关联'}">
                            <i class="fas fa-${isAssociated ? 'minus' : 'plus'}"></i>
                        </button>
                    </div>
                    <div class="note-item-content">
                        <p>${this.truncateText(this.getPlainTextFromHTML(note.content), 100)}</p>
                        <div class="note-item-meta">
                            <span class="note-date">
                                <i class="fas fa-calendar"></i>
                                ${new Date(note.createdAt).toLocaleDateString()}
                            </span>
                            ${note.tags ? `
                                <div class="note-tags">
                                    ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        availableNotesContainer.innerHTML = notesHtml;
        
        // 添加切换关联事件
        availableNotesContainer.querySelectorAll('.note-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const noteItem = btn.closest('.note-item');
                const noteId = noteItem.dataset.noteId;
                this.toggleNoteAssociation(noteId);
            });
        });
    }
    
    // 新增：检查笔记是否已关联到图片
    isNoteAssociatedWithImage(noteId, imageId) {
        return this.data.imageNoteAssociations.some(assoc => 
            assoc.imageId === imageId && assoc.noteId === noteId
        );
    }
    
    // 新增：切换笔记关联状态
    toggleNoteAssociation(noteId) {
        const imageId = this.currentEditingImage.id;
        const associationIndex = this.data.imageNoteAssociations.findIndex(assoc => 
            assoc.imageId === imageId && assoc.noteId === noteId
        );
        
        if (associationIndex >= 0) {
            // 取消关联
            this.data.imageNoteAssociations.splice(associationIndex, 1);
        } else {
            // 添加关联
            this.data.imageNoteAssociations.push({
                id: this.generateId(),
                imageId: imageId,
                noteId: noteId,
                createdAt: new Date().toISOString()
            });
        }
        
        // 重新加载笔记列表
        this.loadNotesForAssociation();
        this.displayCurrentAssociations();
    }
    
    // 新增：显示当前关联的笔记
    displayCurrentAssociations() {
        const associatedNotesContainer = document.getElementById('associatedNotes');
        const imageId = this.currentEditingImage.id;
        
        const associations = this.data.imageNoteAssociations.filter(assoc => assoc.imageId === imageId);
        
        if (associations.length === 0) {
            associatedNotesContainer.innerHTML = `
                <div class="no-associations-message">
                    <i class="fas fa-link"></i>
                    <p>暂无关联笔记</p>
                </div>
            `;
            return;
        }
        
        const associatedNotesHtml = associations.map(assoc => {
            const note = this.data.notes.find(n => n.id === assoc.noteId);
            if (!note) return '';
            
            return `
                <div class="associated-note-item" data-association-id="${assoc.id}">
                    <div class="associated-note-content">
                        <h6>${this.escapeHtml(note.title)}</h6>
                        <p>${this.truncateText(this.getPlainTextFromHTML(note.content), 60)}</p>
                    </div>
                    <button class="remove-association-btn" title="取消关联">
                        <i class="fas fa-unlink"></i>
                    </button>
                </div>
            `;
        }).join('');
        
        associatedNotesContainer.innerHTML = associatedNotesHtml;
        
        // 添加取消关联事件
        associatedNotesContainer.querySelectorAll('.remove-association-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const associationId = btn.closest('.associated-note-item').dataset.associationId;
                this.removeNoteAssociation(associationId);
            });
        });
    }
    
    // 新增：移除笔记关联
    removeNoteAssociation(associationId) {
        const index = this.data.imageNoteAssociations.findIndex(assoc => assoc.id === associationId);
        if (index >= 0) {
            this.data.imageNoteAssociations.splice(index, 1);
            this.loadNotesForAssociation();
            this.displayCurrentAssociations();
        }
    }
    
    // 新增：筛选笔记
    filterNotesForAssociation(searchTerm) {
        const noteItems = document.querySelectorAll('#availableNotes .note-item');
        const term = searchTerm.toLowerCase();
        
        noteItems.forEach(item => {
            const noteId = item.dataset.noteId;
            const note = this.data.notes.find(n => n.id === noteId);
            if (!note) return;
            
            const titleMatch = note.title.toLowerCase().includes(term);
            const contentMatch = this.getPlainTextFromHTML(note.content).toLowerCase().includes(term);
            const tagMatch = note.tags && note.tags.some(tag => tag.toLowerCase().includes(term));
            
            if (titleMatch || contentMatch || tagMatch || !term) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 新增：创建快速笔记
    createQuickNote() {
        const titleInput = document.getElementById('quickNoteTitle');
        const contentInput = document.getElementById('quickNoteContent');
        
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!title || !content) {
            this.showToast('错误', '请填写笔记标题和内容', 'error');
            return;
        }
        
        // 创建新笔记
        const newNote = {
            id: this.generateId(),
            title: title,
            content: content,
            category: 'notes',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.data.notes.push(newNote);
        
        // 自动关联到当前图片
        this.data.imageNoteAssociations.push({
            id: this.generateId(),
            imageId: this.currentEditingImage.id,
            noteId: newNote.id,
            createdAt: new Date().toISOString()
        });
        
        // 清空输入框
        titleInput.value = '';
        contentInput.value = '';
        
        // 重新加载列表
        this.loadNotesForAssociation();
        this.displayCurrentAssociations();
        
        // 更新统计
        this.updateStats();
    }
    
    // 新增：保存笔记关联
    saveNoteAssociations() {
        this.saveData();
        this.hideNoteAssociationDialog();
        
        // 更新图片详情模态框中的关联笔记显示
        this.updateImageDetailAssociations();
        
        // 显示成功消息
        this.showToast('成功', '笔记关联已保存', 'success');
    }
    
    // 新增：更新图片详情中的关联笔记显示
    updateImageDetailAssociations() {
        const associationsContainer = document.querySelector('#imageDetailModal .associated-notes-display');
        if (!associationsContainer || !this.currentEditingImage) return;
        
        const imageId = this.currentEditingImage.id;
        const associations = this.data.imageNoteAssociations.filter(assoc => assoc.imageId === imageId);
        
        if (associations.length === 0) {
            associationsContainer.innerHTML = `
                <div class="no-associations">
                    <i class="fas fa-link"></i>
                    <span>暂无关联笔记</span>
                </div>
            `;
            return;
        }
        
        const associationsHtml = associations.map(assoc => {
            const note = this.data.notes.find(n => n.id === assoc.noteId);
            if (!note) return '';
            
            return `
                <div class="association-item">
                    <i class="fas fa-sticky-note"></i>
                    <span class="association-title">${this.escapeHtml(note.title)}</span>
                    <button class="view-note-btn" data-note-id="${note.id}" title="查看笔记">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            `;
        }).join('');
        
        associationsContainer.innerHTML = associationsHtml;
        
        // 添加查看笔记事件
        associationsContainer.querySelectorAll('.view-note-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const noteId = btn.dataset.noteId;
                this.openNoteForViewing(noteId);
            });
        });
    }
    
    // 新增：打开笔记查看
    openNoteForViewing(noteId) {
        // 切换到笔记页面并高亮显示指定笔记
        this.showSection('notes');
        
        // 延迟一下确保页面切换完成
        setTimeout(() => {
            const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
            if (noteElement) {
                noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                noteElement.classList.add('highlight');
                
                // 3秒后移除高亮
                setTimeout(() => {
                    noteElement.classList.remove('highlight');
                }, 3000);
            }
        }, 300);
    }
    
    // 新增：获取图片关联的笔记
    getImageAssociatedNotes(imageId) {
        const associations = this.data.imageNoteAssociations.filter(assoc => assoc.imageId === imageId);
        return associations.map(assoc => {
            return this.data.notes.find(note => note.id === assoc.noteId);
        }).filter(note => note); // 过滤掉可能的undefined
    }
    
    // 新增：移除图片笔记关联（从图片详情中调用）
    removeImageNoteAssociation(associationId) {
        const index = this.data.imageNoteAssociations.findIndex(assoc => assoc.id === associationId);
        if (index >= 0) {
            this.data.imageNoteAssociations.splice(index, 1);
            this.saveData();
            
            // 更新当前图片详情显示
            if (this.currentEditingImage) {
                this.displayAssociatedNotes(this.currentEditingImage);
                // 同时更新图片卡片
                this.showImages();
            }
            
            this.showToast('成功', '已取消笔记关联', 'success');
        }
    }
}

// 页面加载完成后初始化知识库系统
document.addEventListener('DOMContentLoaded', () => {
    window.knowledgeBase = new KnowledgeBase();
    
    // 多次尝试更新统计信息
    setTimeout(() => {
        if (window.knowledgeBase) {
            window.knowledgeBase.updateLinksPageStats();
        }
    }, 500);
    
    setTimeout(() => {
        if (window.knowledgeBase) {
            window.knowledgeBase.updateLinksPageStats();
        }
    }, 1000);
    
    setTimeout(() => {
        if (window.knowledgeBase) {
            window.knowledgeBase.updateLinksPageStats();
        }
    }, 2000);
});