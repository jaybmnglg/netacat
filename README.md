# ITExam Shuffle Quiz

A small personal browser app for importing ITExamAnswers quiz pages and practicing them in a shuffled, cleaner UI.

## Run

```powershell
npm start
```

Then open:

```text
http://localhost:5177
```

If that port is already busy:

```powershell
$env:PORT='5179'; npm start
```

## Use

1. Paste an ITExamAnswers quiz URL.
2. Click `Import URL`.
3. Answer questions in shuffled order.
4. Use `Review` to reveal the answer key and explanations.

The importer supports the `wpProQuiz` test-online format used by:

```text
https://itexamanswers.net/ccna-2-v7-modules-1-4-switching-concepts-vlans-and-intervlan-routing-test-online.html
```

It also tries to follow the linked answer page so explanations and correct answers can be merged into the quiz.

If a page blocks fetching, copy the visible page content or saved HTML and use the paste importer.
