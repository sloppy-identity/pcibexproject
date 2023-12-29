PennController.ResetPrefix(null)

DebugOff()

Header(
    // Declare global variables to store the participant's ID and demographic information
    newVar("AGE").global(),
    newVar("GENDER").global(),
    newVar("LINGUIST").global()
)
 // Add the particimant info to all trials' results lines
.log( "age"    , getVar("AGE") )
.log( "gender" , getVar("GENDER") )
.log( "linguist" , getVar("LINGUIST") )

Sequence("intro_form", "participants", "instructions", randomize("practice"), "break", shuffle(randomize("main"), randomize("sep")), "send", "completion_screen")

newTrial("intro_form",
    newHtml("intro_form", "ethics.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("Вы должны согласиться с обработкой персональных данных.")
        .print()
        .log()
    ,
    newButton("continue", "Нажмите, чтобы продолжить")
        .center()
        .print()
        .wait(getHtml("intro_form").test.complete()
                  .failure(getHtml("intro_form").warn())
        )
)

// Participant information: questions appear as soon as information is input
newTrial("participants",
    defaultText
        .cssContainer({"margin-top":"1em", "margin-bottom":"1em"})
        .print()
    ,
    newText("participant_info_header", "<div class='fancy'><h2>Сначала, пожалуйста, ответьте на несколько вопросов.</h2></div>")
    ,
    // Age
    newText("<b>Сколько Вам лет?</b><br>(нажмите Enter, чтобы перейти к следующему вопросу)")
    ,
    newTextInput("input_age")
        .length(2)
        .log()
        .print()
        .wait()
    ,
    // Gender
    newText("<b>Укажите Ваш пол</b>")
    ,
    newScale("input_gender",   "женский", "мужской", "другое")
        .radio()
        .log()
        .labelsPosition("right")
        .print()
        .wait()
    ,
    // Linguistics education
    newText("<b>Есть ли у Вас лингвистическое образование (в т.ч. неоконченное)?</b>")
    ,
    newScale("input_linguist",   "Да", "Нет")
        .radio()
        .log()
        .labelsPosition("right")
        .print()
        .wait()
    ,
    // Clear error messages if the participant changes the input
    // newKey("just for callback", "") 
    //     .callback( getText("errorage").remove() , getText("errorID").remove() )
    // ,
    // Formatting text for error messages
    defaultText.color("Crimson").print()
    ,
    // Continue. Only validate a click when ID and age information is input properly
    newButton("weiter", "Перейти к инструкции")
        .cssContainer({"margin-top":"1em", "margin-bottom":"1em"})
        .print()
        // Check for participant ID and age input
        .wait(
             newFunction('dummy', ()=>true).test.is(true)
            // Age
                .and( getTextInput("input_age").test.text(/^\d+$/)
                .failure( newText('errorage', "Bitte tragen Sie Ihr Alter ein."), 
                          getTextInput("input_age").text("")))  
        )
    ,
    // Store the texts from inputs into the Var elements
    getVar("AGE")    .set( getTextInput("input_age") ),
    getVar("GENDER") .set( getScale("input_gender") ),
    getVar("LINGUIST")   .set( getScale("input_linguist") )
)




newTrial("instructions",
    newHtml("instructions", "instructions.html")
        .cssContainer({"width":"720px"})
        .checkboxWarning("Вы должны согласиться с обработкой персональных данных.")
        .print()
        .log()
    ,
    newButton("continue", "Нажмите, чтобы продолжить")
        .center()
        .print()
        .wait(getHtml("instructions").test.complete()
                  .failure(getHtml("instructions").warn())
        )
)

Template("practice_trials.csv", variable =>
    newTrial("practice"
        ,
        newText("task",variable.sentence)
            .center()
            .print()
        ,
        newTimer("wait", 10000)
            .start()
            .wait()
        ,
        getText("task").remove()
        ,

        newImage("target", variable.png)
          .size("40vw","auto")
            .center()
          .print()
          
        ,
        newVar("RT").global().set( v => Date.now() )
        ,

        newText("blank", " ")
          .center()
          .hidden()
        ,

        newText("sentence", variable.sentence)
          .center()
          .print()
        ,
        newText("question", "Правильно ли выполнено задание?")
          .center()
          .print()
        ,

    newTimer("hurry", 6000).start()
        .log("outcome", variable.png)
        ,
    newTimer("dummy", 1)
        .callback(
            newScale("Соблюдены ли инструкции?", "Да", "Нет")
                .labelsPosition("right")
                .radio()
                .center()
                .print()
                .wait(newText("feedback", variable.feedback)
                    .print())
                .log()
            ,
            getVar("RT").set( v => Date.now() - v ).log()
            ,
            getTimer("hurry").stop()
        )
        .start()
    ,
    getTimer("hurry").wait()


    )
    .log("sentence", variable.sentence)
    .log("png", variable.png)
)

newTrial("break",
    newText("prep", "Теперь вы можете проходить эксперимент.")
        .center()
        .print()
    ,
    newButton("continue", "Нажмите, чтобы перейти к эксперименту")
        .center()
        .print()
        .wait()
        
)

Template("filler_items.csv", variable =>
    newTrial("main"
        ,
        newText("task",variable.sentence)
            .center()
            .print()
        ,
        newTimer("wait", 10000)
            .start()
            .wait()
        ,
        getText("task").remove()
        ,
        newImage("target", variable.png)
          .size("45vw","auto")
            .center()
          .print()
          .log("outcome", variable.png)
        ,
        newVar("RT").global().set( v => Date.now() )
        ,
        newText("blank", " ")
          .center()
          .hidden()
        ,

        newText("sentence", variable.sentence)
          .center()
          .print()
        ,
        newText("question", "Правильно ли выполнено задание?")
          .center()
          .print()
        ,

    newTimer("hurry", 6000).start()
        .log("outcome", variable.png)
        ,
    newTimer("dummy", 1)
        .callback(
            newScale("Соблюдены ли инструкции?", "Да", "Нет")
                .labelsPosition("right")
                .radio()
                .center()
                .print()
                .wait()
                .log()
            ,
            getVar("RT").set( v => Date.now() - v ).log()
            ,
            getTimer("hurry").stop()
        )
        .start()
    ,
    getTimer("hurry").wait()


    )
    .log("group", variable.group)
    .log("environment", variable.environment)
    .log("sentence", variable.sentence)
    .log("png", variable.png)
    .log("condition",variable.condition)
    .log("expected",variable.expected)
)

Template("sep.csv", variable =>
    newTrial("sep"
        ,
        newText("task",variable.sentence)
            .center()
            .print()
        ,
        newTimer("wait", 10000)
            .start()
            .wait()
        ,
        getText("task").remove()
        ,

        newImage("target", variable.png)
          .size("40vw","auto")
            .center()
          .print()
          
        ,
        newVar("RT").global().set( v => Date.now() )
        ,

        newText("blank", " ")
          .center()
          .hidden()
        ,

        newText("sentence", variable.sentence)
          .center()
          .print()
        ,
        newText("question", "Правильно ли выполнено задание?")
          .center()
          .print()
        ,

    newTimer("hurry", 6000).start()
        .log("outcome", variable.png)
        ,
    newTimer("dummy", 1)
        .callback(
            newScale("Соблюдены ли инструкции?", "Да", "Нет")
                .labelsPosition("right")
                .radio()
                .center()
                .print()
                .wait()
                .log()
            ,
            getVar("RT").set( v => Date.now() - v ).log()
            ,
            getTimer("hurry").stop()
        )
        .start()
    ,
    getTimer("hurry").wait()


    )
    .log("group", variable.group)
    .log("environment", variable.environment)
    .log("sentence", variable.sentence)
    .log("png", variable.png)
    .log("condition",variable.condition)
    .log("expected",variable.expected)
)




// Send results manually
SendResults("send")

// Completion screen
newTrial("completion_screen",
    newText("thanks", "Спасибо за участие! Вы можете закрыть это окно.")
        .center()
        .print()
    ,
    newButton("wait", "")
        .wait()
)
