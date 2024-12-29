import { GitIngest } from "../src/index.js";

async function test() {
  console.log("开始测试...\n");

  // 1. 测试本地目录选择性分析
  console.log("1. 测试本地目录选择性分析");
  const localIngest = new GitIngest({
    tempDir: "./temp-test",
    keepTempFiles: false,
  });

  try {
    // // 测试分析特定目录
    // console.log("\n1.1 分析特定目录：");
    // console.log("正在分析目录...");
    // // const dirResult = await localIngest.analyzeFromDirectory("./", {
    // //   excludePatterns: ['*.test.ts', '*.spec.ts', 'dist/**']
    // // });
    // const dirResult = await localIngest.analyzeFromDirectory("./", {
    //   excludePatterns: ['.png', '.jpg', 'public/**', 'dist/**']
    // });
    // console.log("分析完成！");
    // console.log("\n分析结果:");
    // console.log("- 文件数:", dirResult.metadata.files);
    // console.log("- 总大小:", dirResult.metadata.size, "bytes");
    // console.log("\n目录结构:");
    // console.log(dirResult.tree);

    // 测试分析特定文件
    console.log("\n1.2 分析特定文件：");
    console.log("正在分析文件...");
    const fileResult = await localIngest.analyzeFromDirectory("./", {
      targetPaths: ['examples/test/index.ts']
    });
    console.log("分析完成！");
    console.log("\n分析结果:");
    console.log("- 文件数:", fileResult.metadata.files);
    console.log("- 总大小:", fileResult.metadata.size, "bytes");
    // console.log("\n文件内容:");
    // console.log(fileResult.content);
    console.log("\n特定文件扫描出来的的文件树(包含依赖文件)：");
    console.log(fileResult.tree);
  } catch (error) {
    console.error("本地目录分析失败:", error);
  }

  // 2. 测试 GitHub 仓库选择性分析
  // console.log("\n2. 测试 GitHub 仓库选择性分析");
  // const githubIngest = new GitIngest({
  //   tempDir: "./temp-test",
  //   keepTempFiles: false,
  //   defaultPatterns: {
  //     exclude: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
  //   }
  // });

  // try {
  //   const githubResult = await githubIngest.analyzeFromUrl(
  //     "https://github.com/Gijela/gitingest-ts",
  //     {
  //       branch: "main",
  //       maxFileSize: 500 * 1024, // 500KB
  //       targetPaths: [
  //         'src/core/git.ts',           // 分析整个 core 目录
  //         'README.md',           // 分析 README 文件
  //         'package.json'         // 分析 package.json
  //       ]
  //     }
  //   );
  //   console.log("\nGitHub 仓库分析结果:");
  //   console.log(githubResult.summary);
  //   console.log("\n目录结构:");
  //   console.log(githubResult.tree);
  //   console.log("\n文件内容:");
  //   console.log(githubResult.content);
  // } catch (error) {
  //   console.error("GitHub 仓库分析失败:", error);
  // }
}

test().catch(console.error); 