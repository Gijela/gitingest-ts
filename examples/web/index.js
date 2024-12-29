document.addEventListener("DOMContentLoaded", () => {
  const localTab = document.getElementById("localTab");
  const githubTab = document.getElementById("githubTab");
  const localForm = document.getElementById("localForm");
  const githubForm = document.getElementById("githubForm");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const results = document.getElementById("results");
  const fileContents = document.getElementById("fileContents");

  // 切换表单
  localTab.addEventListener("click", () => {
    localTab.classList.replace("bg-gray-300", "bg-blue-500");
    localTab.classList.replace("text-gray-700", "text-white");
    githubTab.classList.replace("bg-blue-500", "bg-gray-300");
    githubTab.classList.replace("text-white", "text-gray-700");
    localForm.classList.remove("hidden");
    githubForm.classList.add("hidden");
  });

  githubTab.addEventListener("click", () => {
    githubTab.classList.replace("bg-gray-300", "bg-blue-500");
    githubTab.classList.replace("text-gray-700", "text-white");
    localTab.classList.replace("bg-blue-500", "bg-gray-300");
    localTab.classList.replace("text-white", "text-gray-700");
    githubForm.classList.remove("hidden");
    localForm.classList.add("hidden");
  });

  // 创建文件内容展示元素
  function createFileContentElement(filePath, content) {
    const fileDiv = document.createElement("div");
    fileDiv.className = "bg-gray-50 p-4 rounded";

    const header = document.createElement("div");
    header.className = "font-semibold mb-2 text-blue-600";
    header.textContent = filePath;

    const codeBlock = document.createElement("div");
    codeBlock.className = "code-block bg-gray-100 p-4 rounded";
    codeBlock.textContent = content;

    fileDiv.appendChild(header);
    fileDiv.appendChild(codeBlock);

    return fileDiv;
  }

  // 分析按钮点击事件
  analyzeBtn.addEventListener("click", async () => {
    const isLocal = !localForm.classList.contains("hidden");
    const endpoint = isLocal ? "/analyze/local" : "/analyze/github";

    let data;
    if (isLocal) {
      const path = document.getElementById("localPath").value;
      if (!path) {
        alert("请输入目录路径");
        return;
      }
      data = {
        path,
        targetPaths: document.getElementById("localTargetPaths").value,
      };
    } else {
      const url = document.getElementById("githubUrl").value;
      if (!url) {
        alert("请输入仓库 URL");
        return;
      }
      data = {
        url,
        branch: document.getElementById("branch").value,
        targetPaths: document.getElementById("githubTargetPaths").value,
      };
    }

    try {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "分析中...";

      const response = await fetch(`https://101sda.zeabur.app${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      const { data: analysisResult } = result;

      // 显示结果
      document.getElementById("metadata").textContent =
        `文件数: ${analysisResult.metadata.files}
总大小: ${analysisResult.metadata.size} bytes
预估Token数: ${analysisResult.metadata.tokens}`;

      document.getElementById("tree").textContent = analysisResult.tree;
      document.getElementById("summary").textContent = analysisResult.summary;

      // 清空并显示文件内容
      fileContents.innerHTML = "";

      // 调试输出
      console.log("Content to parse:", analysisResult.content);

      // 分割文件内容
      const files = analysisResult.content
        .split(/File: /)
        .filter(Boolean)
        .map((section) => {
          const lines = section.split("\n");
          const filePath = lines[0].trim();
          const content = lines.slice(2).join("\n").trim(); // 跳过分隔线
          return { filePath, content };
        });

      // 调试输出
      console.log("Parsed files:", files);

      // 创建文件内容元素
      files.forEach(({ filePath, content }) => {
        const fileElement = createFileContentElement(filePath, content);
        fileContents.appendChild(fileElement);
      });

      results.classList.remove("hidden");
    } catch (error) {
      console.error("Error details:", error);
      alert(`错误: ${error.message}`);
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "开始分析";
    }
  });
});
