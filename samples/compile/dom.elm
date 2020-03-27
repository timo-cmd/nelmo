import Html exposing (Html, button, text)
import Html exposing (beginnerProgram)
import Html.Events exposing (onClick)


main : Program Never
main =
    beginnerProgram { model = 0, view = view, update = update }


-- UPDATE


type Msg
    = Increment

update : Msg -> Int -> Int
update msg model =
    case msg of
        Increment ->
            model + 1


-- VIEW


view : Int -> Html Msg
view model =
    button [ onClick Increment ] [ text ("Increment: " ++ (toString model)) ]
