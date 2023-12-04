import {
  BlobWriter,
  TextReader,
  ZipWriter,
} from "@zip.js/zip.js"
onmessage = async (e) => {
  const { numOfCorrectAns, numOfWrongAns } = e.data;
  const text = `You answered ${numOfCorrectAns} questions correctly and ${numOfWrongAns} questions incorrectly`;
  const zipWriter = new ZipWriter(new BlobWriter("quiz-app-result/zip"));
  await zipWriter.add("QuizScore.txt", new TextReader(text));
  const blob = await zipWriter.close();
  postMessage(blob);
};
