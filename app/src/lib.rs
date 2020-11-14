use log::{debug, info, warn, Level};
use seed::{prelude::*, *};
use diceroller::*;

mod utils;

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = SharingWrapper, js_name = "canShare")]
    fn is_sharing_supported() -> bool;

    #[wasm_bindgen(js_namespace = SharingWrapper, js_name = "shareText")]
    fn share_text(text: &str) -> JsValue;
}

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
    CopyResultToClipboard,
    ShareResult,
}

fn init(url: Url, _: &mut impl Orders<Msg>) -> Model {
    debug!("Initializing Seed app");

    let mut m = Model::new();

    if let Some(hash) = url.hash() {
        debug!("Trying to parse URL hash '{}'", hash);
        for c in hash.chars() {
            match c {
                'A' => m.pool.add(Die::Ability),
                'P' => m.pool.add(Die::Proficiency),
                'D' => m.pool.add(Die::Difficulty),
                'C' => m.pool.add(Die::Challange),
                'B' => m.pool.add(Die::Boost),
                'S' => m.pool.add(Die::Setback),
                c => {
                    warn!("Got invalid die character in URL: {}. Will be ignored", c);
                }
            }
        }
    }

    update_url(&m);
    m
}

fn update(msg: Msg, model: &mut Model, _: &mut impl Orders<Msg>) {
    debug!("update received message {:?}", msg);

    match msg {
        Msg::AddDie(die) => {
            model.add_die(die);
            update_url(model);
        }
        Msg::RemoveDie(die) => {
            model.remove_die(die);
            update_url(model);
        }
        Msg::Roll => model.roll = Some(model.pool.roll()),
        Msg::ClearPool => {
            model.pool.clear();
            model.roll = None;
            update_url(model);
        }
        Msg::CopyResultToClipboard => {
            let window = web_sys::window().expect("no global `window` exists");
            window.navigator().clipboard().write_text(&format!(
                "{}",
                model
                    .roll
                    .as_ref()
                    .expect("must have a roll to copy")
                    .aggregate()
            ));
        }
        Msg::ShareResult => {
            if !is_sharing_supported() {
                error!("sharing is not supported on this device");
                return;
            }

            debug!("Sharing result text");

            let r = share_text(&format!(
                "{}",
                model
                    .roll
                    .as_ref()
                    .expect("must have a roll to copy")
                    .aggregate()
            ));

            info!("{:?}", r);
        }
    }
}

fn update_url(model: &Model) {
    let mut url = "/#".to_owned();

    for d in model.pool.iter() {
        url.push(match d {
            Die::Ability => 'A',
            Die::Proficiency => 'P',
            Die::Difficulty => 'D',
            Die::Challange => 'C',
            Die::Boost => 'B',
            Die::Setback => 'S',
        });
    }

    let window = web_sys::window().expect("no global `window` exists");
    window
        .history()
        .expect("history object not found")
        .replace_state_with_url(&wasm_bindgen::JsValue::NULL, "", Some(&url))
        .expect("failed to update history");
}

fn view(model: &Model) -> Vec<Node<Msg>> {
    app_shell(div![
        C!["row"],
        div![
            C!["col s12 m6 l4 x4"],
            p![C!["flow-text"], "Click a dice to add it to the pool.",],
            nodes![
                add_die_view(Die::Ability),
                add_die_view(Die::Proficiency),
                add_die_view(Die::Difficulty),
                add_die_view(Die::Challange),
                add_die_view(Die::Boost),
                add_die_view(Die::Setback),
            ],
        ],
        IF!(not(model.pool.is_empty()) =>
            div![
                C!["col s12 m6 l4 x4"],
                p![
                    C!["flow-text"],
                    "Click a dice to remove it from the pool.",
                ],

                p![
                    model
                        .pool
                        .iter()
                        .map(|e| remove_die_view(*e))
                        .collect::<Vec<Node<Msg>>>(),
                ],

                p![
                    C!["right"],
                    button![
                        C!["btn waves-effect waves-light blue-grey darken-4 m-r2 material-icons"],
                        "casino",
                        ev(Ev::Click, |_| Msg::Roll),
                    ],
                    button![
                        C!["btn waves-effect waves-light blue-grey darken-1 material-icons"],
                        "clear",
                        ev(Ev::Click, |_| Msg::ClearPool),
                    ],
                ]
            ]
        ),
        model.roll.as_ref().map(pool_roll_view),
    ])
}

fn pool_roll_view(pool_roll: &PoolRoll) -> Node<Msg> {
    div![
        C!["col s12 m6 l4 x4"],
        p![
            C!["flow-text", "result"],
            format!("{}", pool_roll.aggregate()),
        ],
        p![
            C!["right"],
            button![
                C!["btn waves-effect waves-light blue-grey darken-4 m-r2 material-icons"],
                "content_copy",
                ev(Ev::Click, |_| Msg::CopyResultToClipboard),
            ],
            IF!(is_sharing_supported() => button![
                C!["btn waves-effect waves-light blue-grey darken-4 m-r2 material-icons"],
                "share",
                ev(Ev::Click, |_| Msg::ShareResult),
            ]),
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

fn app_shell(body: Node<Msg>) -> Vec<Node<Msg>> {
    nodes![
        header![nav![div![
            C!["nav-wrapper blue-grey darken-4"],
            a![
                C!["brand-logo left"],
                attrs!["href" => "/"],
                "Dice Roller",
            ],
        ],],],
        main![div![C!["container"], body,],],
        footer![
            C!["page-footer blue-grey darken-2"],
            div![
                C!["container"],
                div![
                    C!["row"],
                    div![
                        C!["col s12 m6"],
                        p![
                            format!(
                                "DiceRoller v{}.", VERSION
                            ),
                        ],
                        p![
                            "Copyright (c) 2020 Alexander Metzner.",
                        ],
                    ],
                    div![
                        C!["col s12 m6 right"],
                        a![
                            C!["grey-text"],
                            attrs!("href" => "https://bitbucket.org/halimath/diceroller/src/master/"),
                            "bitbucket.org/halimath/diceroller",
                        ],
                    ],
                ]
            ],
        ],
    ]
}

#[wasm_bindgen(js_name = start)]
pub fn main() {
    utils::set_panic_hook();
    console_log::init_with_level(Level::Debug).expect("failed to set log level");

    info!(
        "DiceRoller v{} (Client App v{})",
        diceroller::VERSION,
        VERSION
    );

    // Mount the `app` to the element with the `id` "app".
    App::start("app", init, update, view);
}
