/* 폴더 정리 프로세스

- video, captured, duplicated

- node photo [test] 로 실행
- 해당 [test] 파일에!
- 요구사항
1. mp4, mov 확장자 파일 -> video 폴더로
2. aae, png 확장자 파일 -> captured 폴더로
3. 수정된 원본 사진-> duplicated 폴더로

*/
// Import
const fs = require("fs");
const path = require("path");

// 확장자 설정
const capturedExtName = [".aae", ".png"];
const videoExtName = [".mp4", ".mov"];

// 정리할 폴더명 세팅
const targetFolder = process.argv[2];

// 폴더 이름이 입력되지 않았다면, 프로그램 종료
if (targetFolder == null) {
  console.warn("정리할 폴더 이름을 입력해주세요.");
  return;
}

// 해당 폴더가 존재하지 않을 경우!
if (!fs.existsSync(targetFolder)) {
  console.warn(`${targetFolder} 해당 폴더는 존재하지 않습니다.`);
  return;
}

// 폴더 생성 - video, captured, duplicated
makeFolder(targetFolder, "captured");
makeFolder(targetFolder, "video");
makeFolder(targetFolder, "duplicated");

// 각 폴더 경로 세팅
const videoFolder = path.join(targetFolder, "video");
const capturedFolder = path.join(targetFolder, "captured");
const duplicatedFolder = path.join(targetFolder, "duplicated");

// 정리 시작!
fs.readdir(targetFolder, (error, lstFiles) => {
  // error 가 있다면 출력 및 종료
  error && console.error(error);

  // 폴더 정리
  lstFiles.forEach((file) => {
    solution(file, lstFiles);
  });
});

//#region - Solution 함수 모음

// 파일 정리
// Q. 폴더를 먼저 다 만들고 옮겨야 되는지 -> 빈폴더가 생성될수도 있음. => 이걸로 가쟈!!!
//      or 해당 폴더로 넣을 파일 있는 경우만 생성 해야되는지? -> 이동할때마다 폴더 존재여부를 체크하는것에 자원이 소모됨.
function solution(file, lstFiles) {
  if (isVedio(file)) {
    moveFileTo(targetFolder, file, videoFolder);
  } else if (isCaptured(file)) {
    moveFileTo(targetFolder, file, capturedFolder);
  } else if (isDuplicated(file, lstFiles)) {
    moveFileTo(targetFolder, file, duplicatedFolder);
  }
}

// 비디오 인지?
function isVedio(file) {
  if (videoExtName.includes(path.extname(file))) {
    return true;
  }
  return false;
}

// 캡쳐본인지?
function isCaptured(file) {
  if (capturedExtName.includes(path.extname(file))) {
    return true;
  }
  return false;
}

// 중복인지?
// Duplicated 폴더로 갈 파일이 있는지 체크
// 1. E라는 키워드가 없으면 false 리턴,
// 2. E 키워드를 제외한 같은 파일이 있다면 true 리턴!
function isDuplicated(fileName, lstFiles) {
  if (fileName.search("_E") == -1) {
    return false;
  }

  for (let file of lstFiles) {
    if (file != fileName && file.replace("_E", "_") === fileName) {
      return true;
    }
  }

  return false;
}
//#endregion

//#region - 파일 함수 모음

// 파일 혹은 폴더가 존재하는지
function checkExists(folderPath, folderName) {
  if (fs.existsSync(path.join(folderPath, folderName))) {
    return true;
  }
  return false;
}

// 폴더 생성
function makeFolder(folderPath, folderName) {
  // 폴더가 존재한다면 리턴!
  if (checkExists(folderPath, folderName)) {
    console.info(`${folderName} 해당 폴더는 이미 존재합니다.`);
    return;
  }

  // 폴더 생성
  fs.promises
    .mkdir(path.join(folderPath, folderName)) //
    .catch(console.error);
}

// 파일 이동
function moveFileTo(filePath, fileName, movePath) {
  // 파일이 존재할 경우에만 이동가능
  if (!fs.existsSync(path.join(filePath, fileName))) {
    console.warn(`${fileName} 해당 파일은 존재하지 않습니다.`);
    return;
  }

  // 파일 이동
  fs.promises
    .rename(path.join(filePath, fileName), path.join(movePath, fileName))
    .then(
      console.log(
        path.join(filePath, fileName) + " -> " + path.join(movePath, fileName)
      )
    )
    .error(console.error);
}

//#endregion
