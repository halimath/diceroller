use log::{debug, info, Level};
use seed::{prelude::*, *};
use swrpgdiceroller::*;

mod utils;

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[derive(Clone)]
struct Model {
    pool: Pool,
    roll: Option<PoolRoll>,
}

impl Model {
    fn new() -> Model {
        Model {
            pool: Pool::empty(),
            roll: None,
        }
    }

    fn add_die(&mut self, d: Die) {
        self.pool.add(d);
    }

    fn remove_die(&mut self, d: Die) {
        self.pool.remove(d);
    }
}

#[derive(Debug)]
enum Msg {
    AddDie(Die),
    RemoveDie(Die),
    Roll,
    ClearPool,
}

fn init (_: Url, _: &mut impl Orders<Msg>) -> Model {
    debug!("Initializing Seed app");
    Model::new()
}

fn update(msg: Msg, model: &mut Model, _: &mut impl Orders<Msg>) {
    debug!("update received message {:?}", msg);

    match msg {
        Msg::AddDie(die) => model.add_die(die),
        Msg::RemoveDie(die) => model.remove_die(die),
        Msg::Roll => model.roll = Some(model.pool.roll()),
        Msg::ClearPool => {
            model.pool.clear();
            model.roll = None;
        }
    }
}

fn view(model: &Model) -> Node<Msg> {
    div![
        C!["row"],
        div![
            C!["col s12 m6 l4 x4"],
            h3!["Available Dice"],
            p![
                C!["flow-text"],
                "Click a dice to add it to the pool.",
            ],
            nodes![
                add_die_view(Die::Ability), 
                add_die_view(Die::Proficiency), 
                add_die_view(Die::Difficulty),
                add_die_view(Die::Challange),
                add_die_view(Die::Boost),
                add_die_view(Die::Setback),
            ],
        ],

        div![
            C!["col s12 m6 l4 x4"],
            h3!["Pool"],
            p![
                C!["flow-text"],
                "Click a dice to remove it from the pool.",
            ],
            div![
                model
                    .pool
                    .iter()
                    .map(|e| remove_die_view(*e))
                    .collect::<Vec<Node<Msg>>>(),
            ],

            IF!(not(model.pool.is_empty()) => p![
                button![
                    C!["btn waves-effect waves-light blue-grey darken-4 m-r2"],
                    "Roll",
                    ev(Ev::Click, |_| Msg::Roll),
                ],
                button![
                    C!["btn waves-effect waves-light blue-grey darken-1"],
                    "Clear",
                    ev(Ev::Click, |_| Msg::ClearPool),
                ],    
                ]
            ),
        ],

        model.roll.as_ref().map(pool_roll_view),
    ]
}

fn pool_roll_view(pool_roll: &PoolRoll) -> Node<Msg> {
    div![
        C!["col s12 m6 l4 x4"],

        h3!["Result"],

        p![
            C!["flow-text"],
            format!("{}", pool_roll.aggregate()),
        ],
    ]
}

fn remove_die_view(die: Die) -> Node<Msg> {
    die_btn(die, ev(Ev::Click, move |_| Msg::RemoveDie(die)))
}

fn add_die_view(die: Die) -> Node<Msg> {
    die_btn(die, ev(Ev::Click, move |_| Msg::AddDie(die)))
}

fn die_btn(die: Die, evt: EventHandler<Msg>) -> Node<Msg> {
    let (style_classes, label) = match die {
        Die::Ability => ("green", "A"),
        Die::Proficiency => ("yellow black-text", "P"),
        Die::Difficulty => ("purple darken-3", "D"),
        Die::Challange => ("red", "C"),
        Die::Boost => ("blue lighten-2 black-text", "B"),
        Die::Setback => ("black", "S"),
    };

    button![
        C!["btn-floating waves-effect waves-light m-r2", style_classes],
        label,
        evt,
    ]
}

#[wasm_bindgen(js_name = start)]
pub fn main() {
    utils::set_panic_hook();
    console_log::init_with_level(Level::Debug).expect("failed to set log level");

    info!(
        "SW RPG DiceRoller v{} (Client App v{})",
        swrpgdiceroller::VERSION,
        VERSION
    );

    // Mount the `app` to the element with the `id` "app".
    App::start("app", init, update, view);

    // let window = web_sys::window().expect("no global `window` exists");
    // let document = window.document().expect("should have a document on window");
    // let app_container = document.get_element_by_id("app").expect("unable to find app container");

    // let val = document.create_element("p").expect("unable to create p element");
    // val.set_inner_html("Hello from Rust!");

    // app_container.append_child(&val).expect("unable to append child");
}
