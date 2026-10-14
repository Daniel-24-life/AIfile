# 添加下一项作品

项目登记表是导航的唯一来源：`catalog/projects.json`。个人简介是手写区，项目区由
生成器更新。本流程不创建远端仓库、不运行真实业务任务、不自动发布。

## 创建本地草稿

从 AIfile 根目录运行：

```powershell
python scripts/new_project.py --id my-next-project --category business-products
```

输出位于被 Git 忽略的 `inbox/my-next-project/`，登记项为 `published: false`。
重复 ID、已有目录和未知分类会被拒绝。草稿不会出现在主页或目录中。

五类 ID：business-products、agent-governance、research-content、methods-learning、engineering-retrospectives。

## 完善与登记

1. 填写问题、实现范围、运行方法、证据和限制，区分计划、样例与已实现能力。
2. 选择公开位置：独立仓库，或 AIfile 的项目目录。只整理允许公开的副本。
3. 登记标题、摘要、实现状态、仓库、入口、封面、架构、源码与验证链接。
4. 如需首页精选，设置唯一的正整数 featured_order；普通项目保持 null。
5. 完成公开包与检查后设 published 为 true。release 仅填写真实发布日期与说明。

独立仓库是其代码的唯一维护源。AIfile 不复制完整代码，保留介绍、静态预览和链接。

## 生成与检查

```powershell
python scripts/render_portfolio.py
python scripts/render_portfolio.py --check
python scripts/verify_public_packages.py
```

生成器只更新 README.md 与 README.en.md 的 portfolio 标记区。个人主页仓库同样
使用该标记；更新时指定本地路径和已提交的 AIfile 来源 SHA：

```powershell
python scripts/render_portfolio.py --profile-dir ../Daniel-24-life --source-commit FULL_COMMIT_SHA
```

来源写入个人主页的 catalog-source.json。主页 CI 获取该固定提交核对生成内容。
两仓库分别审阅、提交和发布；新增项目工具本身不会替你上传。

## 发布检查

使用[项目模板](../templates/project/)补齐说明；确保运行、测试、图片与链接可复核。
对外发布后再次检查入口，更新登记和近期发布区。状态、许可证与公开边界分别维护。
