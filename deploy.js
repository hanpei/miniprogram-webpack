#!/usr/bin/env node
const program = require('commander');
const shell = require('shelljs');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const packageJSON = require('./package.json');
const ver = packageJSON.version;
const execSync = require('child_process').execSync;
// const path = require('path');

console.log('=========== 小程序命令行工具 ===========');
console.log(`小程序名称 [${packageJSON.name}]`);
console.log(`当前版本 [${packageJSON.version}]`);
console.log(`当前目录 [${__dirname}]`);
console.log('======================================');
console.log('\n');

program
  .command('build [env]')
  .description('打包小程序，需要指定打包env')
  .action((env) => build(env));

program
  .command('publish [env]')
  .description(`发布小程序, 当前版本号为 ${ver}`)
  .option('-v, --version <version>', '发版版本号')
  .option('-m, --message <message>', '发版信息')
  .action((env, version, message) => publishFlow(env, version, message));

program.parse(process.argv);

function publishFlow(env, version, message) {
  build(env)
    .then(({ success, env }) => {
      if (success) {
        publish(version, message, env);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function build(env) {
  const buildCmd = (env) => {
    const spinner = ora('webpack打包小程序......');
    spinner.start();
    // const result = shell.exec(`npm run build:${env}`, { silent: true });
    return new Promise((resolve, reject) => {
      shell.exec(
        `npm run build:${env}`,
        { silent: true },
        (code, stdout, stderr) => {
          if (code === 0) {
            spinner.succeed();
            resolve({ success: true, env });
          } else {
            spinner.fail();
            console.log(stderr);
            reject(stderr);
          }
        },
      );
    });
  };

  if (env === 'test' || env === 'production') {
    return buildCmd(env);
  } else {
    return inquirer
      .prompt([
        {
          name: 'env',
          type: 'list',
          message: `选择小程序打包环境变量[env]:`,
          choices: ['test', 'production'],
        },
      ])
      .then(({ env }) => {
        return buildCmd(env);
      });
  }
}

function publish(version, message, env) {
  const uploadCmd = (version, message) => {
    const spinner = ora('上传小程序......');
    spinner.start();

    return new Promise((resolve, reject) => {
      shell.exec(
        `/Applications/wechatwebdevtools.app/Contents/MacOS/cli -u ${version}@${__dirname} --upload-desc '${message}' --upload-info-output ${__dirname}/info.json`,
        { silent: false },
        async (code, stdout, stderr) => {
          if (code === 0) {
            spinner.succeed();
            await updatePackageVersion(version);
            await writeVerFile(version, env);
            await updateGit();
          } else {
            spinner.fail();
            console.log(stderr);
            reject(stderr);
          }
        },
      );
    });
  };
  if (!version || !message) {
    inquirer
      .prompt([
        /* Pass your questions in here */
        {
          name: 'version',
          type: 'input',
          message: `当前版本号为 ${ver}, 输入发布新版本号:`,
          validate(input) {
            if (input === '') {
              console.log('必须输入版本号');
              return false;
            }
            if (compareVerSimple(input, ver) < 0) {
              console.log('新版本号不能小于当前版本号');
              return false;
            }
            return true;
          },
        },
        {
          name: 'message',
          type: 'input',
          message: '输入版本描述信息:',
          validate(input) {
            if (input === '') {
              console.log('必须输入版本描述信息');
              return false;
            }
            return true;
          },
        },
      ])
      .then(({ version, message }) => {
        // Use user feedback for... whatever!!
        const msg = `[${env}]: ${message}`;
        uploadCmd(version, msg);
      });
  } else {
    const msg = `[${env}]: ${message}`;
    uploadCmd(version, msg);
  }
}

async function updatePackageVersion(version) {
  packageJSON.version = version;
  // 同步写入package.json文件
  const spinner = ora('更新package.json中version参数');
  spinner.start();
  try {
    fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, 2));
    spinner.succeed(`更新package.json中version参数: ${version}`);
  } catch (error) {
    spinner.fail();
    console.log(error);
  }
}

async function writeVerFile(version, env) {
  const spinner = ora('更新package.json中version参数');
  spinner.start();

  try {
    const branch = execSync('git symbolic-ref --short -q HEAD')
      .toString()
      .trim();
    const commitId = execSync('git rev-parse --short HEAD').toString().trim();
    const log = execSync('git log -1').toString().trim();
    const data =
      version +
      '\n' +
      'env = ' +
      env +
      '\n' +
      branch +
      '\n' +
      commitId +
      '\n' +
      log;
    fs.writeFileSync('_ver.txt', data);
    spinner.succeed(`_ver.txt commitId: ${commitId}`);
  } catch (err) {
    spinner.fail();
    console.log('execute error：');
    console.log(err.toString());
  }
}

async function updateGit() {
  const spinner = ora('更新git version');
  spinner.start();

  try {
    execSync('git commit -a -m "chore: version update"');
    execSync('git push');
    spinner.succeed(`git push sucess`);
  } catch (err) {
    spinner.fail();
    console.log('execute error：');
    console.log(err.toString());
  }
}

// 只判断相同位数的
function compareVerSimple(a, b) {
  const m = a.split('.').map((i) => +i); // [1,1,9]
  const n = b.split('.').map((i) => +i); // [1,1,10]
  const len = m.length;
  let i = 0;

  while (i < len) {
    if (m[i] > n[i]) {
      return 1;
    }
    i++;
  }
  if (m[len - 1] === n[len - 1]) {
    return 0;
  }
  return -1;
}
