extern crate rand;

use rand::prelude::*;
use std::collections::HashMap;
use std::slice;

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Symbol {
    Success,
    Advantage,
    Failure,
    Threat,
    Triumph,
    Despair,
    LightSide,
    DarkSide,
}

// --

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Side {
    Blank,
    One(Symbol),
    Two(Symbol, Symbol),
}

impl Side {
    fn symbols(&self) -> Vec<Symbol> {
        match self {
            Side::Blank => Vec::new(),
            Side::One(s) => vec![*s],
            Side::Two(a, b) => vec![*a, *b],
        }
    }
}

// --

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub enum Die {
    Ability,
    Proficiency,
    Difficulty,
    Challange,
    Boost,
    Setback,
    Force,
}

impl Die {
    pub fn sides(&self) -> &[Side] {
        match self {
            Self::Ability => &[
                Side::Blank,
                Side::One(Symbol::Success),
                Side::Two(Symbol::Success, Symbol::Success),
                Side::One(Symbol::Advantage),
                Side::Two(Symbol::Advantage, Symbol::Advantage),
                Side::One(Symbol::Success),
                Side::Two(Symbol::Advantage, Symbol::Success),
                Side::One(Symbol::Advantage),
            ],

            Self::Proficiency => &[
                Side::Blank,
                Side::One(Symbol::Success),
                Side::One(Symbol::Success),
                Side::One(Symbol::Triumph),
                Side::Two(Symbol::Success, Symbol::Success),
                Side::Two(Symbol::Success, Symbol::Success),
                Side::Two(Symbol::Advantage, Symbol::Advantage),
                Side::Two(Symbol::Advantage, Symbol::Advantage),
                Side::One(Symbol::Advantage),
                Side::Two(Symbol::Success, Symbol::Advantage),
                Side::Two(Symbol::Success, Symbol::Advantage),
                Side::Two(Symbol::Success, Symbol::Advantage),
            ],

            Self::Difficulty => &[
                Side::Blank,
                Side::Two(Symbol::Failure, Symbol::Failure),
                Side::One(Symbol::Threat),
                Side::Two(Symbol::Failure, Symbol::Threat),
                Side::Two(Symbol::Threat, Symbol::Threat),
                Side::One(Symbol::Threat),
                Side::One(Symbol::Failure),
                Side::One(Symbol::Threat),
            ],

            Self::Challange => &[
                Side::Blank,
                Side::One(Symbol::Failure),
                Side::One(Symbol::Failure),
                Side::One(Symbol::Threat),
                Side::One(Symbol::Threat),
                Side::One(Symbol::Despair),                
                Side::Two(Symbol::Threat, Symbol::Threat),
                Side::Two(Symbol::Threat, Symbol::Threat),
                Side::Two(Symbol::Failure, Symbol::Failure),
                Side::Two(Symbol::Failure, Symbol::Failure),
                Side::Two(Symbol::Failure, Symbol::Threat),
                Side::Two(Symbol::Failure, Symbol::Threat),
            ],

            Self::Boost => &[
                Side::Blank,
                Side::Blank,
                Side::One(Symbol::Success),
                Side::One(Symbol::Advantage),
                Side::Two(Symbol::Success, Symbol::Advantage),
                Side::Two(Symbol::Advantage, Symbol::Advantage),
            ],

            Self::Setback => &[
                Side::Blank,
                Side::Blank,
                Side::One(Symbol::Failure),
                Side::One(Symbol::Failure),
                Side::One(Symbol::Threat),
                Side::One(Symbol::Threat),
            ],

            Self::Force => &[
                Side::One(Symbol::LightSide),
                Side::One(Symbol::LightSide),
                Side::One(Symbol::DarkSide),
                Side::One(Symbol::DarkSide),
                Side::One(Symbol::DarkSide),
                Side::One(Symbol::DarkSide),
                Side::One(Symbol::DarkSide),
                Side::One(Symbol::DarkSide),
                Side::Two(Symbol::LightSide, Symbol::LightSide),
                Side::Two(Symbol::LightSide, Symbol::LightSide),
                Side::Two(Symbol::LightSide, Symbol::LightSide),
                Side::Two(Symbol::DarkSide, Symbol::DarkSide),
            ],
        }
    }

    pub fn roll(&self) -> DieRoll {
        let sides = self.sides();
        DieRoll::new(*self, sides[random::<usize>() % sides.len()])
    }
}

// --

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct DieRoll {
    pub die: Die,
    pub side: Side,
}

impl DieRoll {
    fn new(die: Die, side: Side) -> DieRoll {
        DieRoll { die, side }
    }

    pub fn symbols(&self) -> Vec<Symbol> {
        self.side.symbols()
    }

    pub fn aggregate(&self) -> AggregatedSymbols {
        AggregatedSymbols::new(slice::from_ref(self))
    }
}

// --

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Pool {
    dice: Vec<Die>,
}

impl Pool {
    pub fn new(dice: Vec<Die>) -> Self {
        let mut s = Self { dice };
        s.sort_dice();
        s
    }    

    pub fn empty() -> Self {
        Self { dice: Vec::new() }
    }

    pub fn add (&mut self, die: Die) {
        self.dice.push(die);
        self.sort_dice();
    }

    pub fn remove(&mut self, die: Die) {
        if let Some(pos) = self.dice.iter().position(|d| *d == die) {
            self.dice.remove(pos);
        }
    }

    pub fn clear(&mut self) {
        self.dice.clear();
    }

    pub fn roll(&self) -> PoolRoll {
        PoolRoll::new(self.dice.iter().map(|d| d.roll()).collect())
    }

    pub fn iter(&self) -> impl Iterator<Item = &Die> {
        self.dice.iter()        
    }

    pub fn is_empty(&self) -> bool {
        self.dice.is_empty()
    }

    fn sort_dice(&mut self) {
        self.dice.sort();
    }
}

// --

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PoolRoll {
    pub dice_rolls: Vec<DieRoll>,
}

impl PoolRoll {
    pub fn new<'a>(dice_rolls: Vec<DieRoll>) -> PoolRoll {
        PoolRoll { dice_rolls }
    }

    pub fn aggregate(&self) -> AggregatedSymbols {
        AggregatedSymbols::new(&self.dice_rolls)
    }
}

// --

#[derive(Debug, Clone)]
pub struct AggregatedSymbols {
    pub totals: HashMap<Symbol, usize>,
}

impl AggregatedSymbols {
    pub fn new(dice_rolls: &[DieRoll]) -> AggregatedSymbols {
        let mut aggregated_symbols = AggregatedSymbols {
            totals: HashMap::new(),
        };

        for roll in dice_rolls {
            for sym in roll.symbols() {
                match sym {
                    Symbol::Triumph => {
                        aggregated_symbols.inc(Symbol::Triumph);
                        aggregated_symbols.inc(Symbol::Success);
                    }
                    Symbol::Despair => {
                        aggregated_symbols.inc(Symbol::Despair);
                        aggregated_symbols.inc(Symbol::Failure);
                    }
                    s => aggregated_symbols.inc(s),
                }
            }
        }

        aggregated_symbols.normalize(Symbol::Success, Symbol::Failure);
        aggregated_symbols.normalize(Symbol::Advantage, Symbol::Threat);
        aggregated_symbols.normalize(Symbol::LightSide, Symbol::DarkSide);

        aggregated_symbols
    }

    fn inc(&mut self, s: Symbol) {
        self.totals.insert(
            s,
            match self.totals.get(&s) {
                None => 1,
                Some(c) => c + 1,
            },
        );
    }

    fn normalize(&mut self, left: Symbol, right: Symbol) {
        if self.totals.contains_key(&left) && self.totals.contains_key(&right) {
            if self.totals[&left] == self.totals[&right] {
                self.totals.remove_entry(&left);
                self.totals.remove_entry(&right);
            } else if self.totals[&left] > self.totals[&right] {
                self.totals
                    .insert(left, self.totals[&left] - self.totals[&right]);
                self.totals.remove_entry(&right);
            } else {
                self.totals
                    .insert(right, self.totals[&right] - self.totals[&left]);
                self.totals.remove_entry(&left);
            }
        }
    }
}

impl std::fmt::Display for AggregatedSymbols {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if self.totals.is_empty() {
            return write!(f, "<blank>");
        }

        let mut text_elements = Vec::new();

        match self.totals.get(&Symbol::Success) {
            Some(1) => text_elements.push("1 Success".to_owned()),
            Some(c) => text_elements.push(format!("{} Successes", c)),
            None => (),
        }
    
        match self.totals.get(&Symbol::Failure) {
            Some(1) => text_elements.push("1 Failure".to_owned()),
            Some(c) => text_elements.push(format!("{} Failures", c)),
            None => (),
        }
    
        match self.totals.get(&Symbol::Advantage) {
            Some(1) => text_elements.push("1 Advantage".to_owned()),
            Some(c) => text_elements.push(format!("{} Advantages", c)),
            None => (),
        }
    
        match self.totals.get(&Symbol::Threat) {
            Some(1) => text_elements.push("1 Threat".to_owned()),
            Some(c) => text_elements.push(format!("{} Threats", c)),
            None => (),
        }
    
        match self.totals.get(&Symbol::Triumph) {
            Some(1) => text_elements.push("1 Triumph".to_owned()),
            Some(c) => text_elements.push(format!("{} Triumphs", c)),
            None => (),
        }
    
        match self.totals.get(&Symbol::Despair) {
            Some(1) => text_elements.push("1 Despair".to_owned()),
            Some(c) => text_elements.push(format!("{} Despairs", c)),
            None => (),
        }
    
        match self.totals.get(&Symbol::LightSide) {
            Some(c) => text_elements.push(format!("{} Light Side", c)),
            None => (),            
        }
    
        match self.totals.get(&Symbol::DarkSide) {
            Some(c) => text_elements.push(format!("{} Dark Side", c)),
            None => (),            
        }    
    
        write!(f, "{}", text_elements.join(", "))
    }
}
