/* GOLDEN FIXTURE (8-a-side) — snapshot of the parser output for the example
 * plays. Regenerated intentionally; the parity test compares parser output to
 * this so behavioral regressions are caught. Regenerate with tests/gen-golden.js. */
(function(g){ g.DB_PLAYS = {
  "away": {
    "id": "away",
    "name": "Away",
    "badge": "3-ball defense",
    "call": "\"Away, 5\"",
    "desc": "We're holding three balls on defense. The call names our counter-thrower — Away, 5 — and they pick their own target, typically whoever just threw. Only their loaded attackers come to the line; as they regress after the throw, our three holders press up about halfway and the called thrower answers on the run.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Their loaded attackers take the line",
        "summary": "to the line · 1 pump fake",
        "dur": 1,
        "moves": [
          {
            "team": "them",
            "n": 2,
            "to": [
              29.428571428571423,
              42
            ]
          },
          {
            "team": "them",
            "n": 4,
            "to": [
              43.14285714285714,
              42
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              56.857142857142854,
              42
            ]
          }
        ],
        "fakes": [
          {
            "team": "them",
            "n": 4,
            "reps": 1
          }
        ]
      },
      {
        "label": "They throw",
        "summary": "throw at 2",
        "dur": 0.9,
        "throws": [
          {
            "from": {
              "team": "them",
              "n": 4
            },
            "to": {
              "team": "us",
              "n": 2
            },
            "outcome": "dodged",
            "curve": 14
          }
        ],
        "dodges": [
          {
            "team": "us",
            "n": 2
          }
        ]
      },
      {
        "label": "We press up halfway as their attackers regress — and counter",
        "summary": "to deep · throw at 4",
        "dur": 1.2,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              43.14285714285714,
              75
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.857142857142854,
              75
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              70.57142857142857,
              75
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              29.428571428571423,
              25
            ]
          },
          {
            "team": "them",
            "n": 4,
            "to": [
              43.14285714285714,
              25
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              56.857142857142854,
              25
            ]
          }
        ],
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 5
            },
            "to": {
              "team": "them",
              "n": 4
            }
          }
        ]
      }
    ]
  },
  "home": {
    "id": "home",
    "name": "Home",
    "badge": "3-ball defense",
    "call": "\"Home, 5\"",
    "desc": "We're holding three balls on defense. The call names our thrower — Home, 5 — and they pick their own target. As their attack comes to the line, the called defender reads the throw and pre-counters: releasing first, from their own position, to hit the thrower before their ball lands.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "They bring it up to the line",
        "summary": "to the line · 1 pump fake",
        "dur": 1,
        "moves": [
          {
            "team": "them",
            "n": 2,
            "to": [
              29.428571428571423,
              42
            ]
          },
          {
            "team": "them",
            "n": 4,
            "to": [
              43.14285714285714,
              42
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              56.857142857142854,
              42
            ]
          }
        ],
        "fakes": [
          {
            "team": "them",
            "n": 4,
            "reps": 1
          }
        ]
      },
      {
        "label": "Home — pre-counter beats their throw",
        "summary": "throw at 5 & 4",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "them",
              "n": 4
            },
            "to": {
              "team": "us",
              "n": 5
            },
            "outcome": "dodged",
            "curve": 14
          },
          {
            "from": {
              "team": "us",
              "n": 5
            },
            "to": {
              "team": "them",
              "n": 4
            }
          }
        ],
        "dodges": [
          {
            "team": "us",
            "n": 5
          }
        ]
      }
    ]
  },
  "insides": {
    "id": "insides",
    "name": "Inside",
    "badge": "4-ball",
    "call": "\"Inside 5, 1\"",
    "desc": "Four-ball call. The four ball-holders parley tightly in the middle and fan to the front line. The two middle holders throw at the same number — here the 5th from the left — after all four holders make one pump fake in unison to pull the block.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": true
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": true
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": true
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders parley tightly in the middle",
        "summary": "parley: call play and choose target",
        "dur": 0.8,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              40.25,
              87
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              46.75,
              87
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              53.25,
              87
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              59.75,
              87
            ]
          }
        ]
      },
      {
        "label": "Step 2 — ball-holders fan to the front line",
        "summary": "to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              29.42857142857143,
              58
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              43.142857142857146,
              58
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.857142857142854,
              58
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              70.57142857142857,
              58
            ]
          }
        ]
      },
      {
        "label": "Step 3 — one pump fake in unison to pull the block",
        "summary": "1 pump fake",
        "dur": 1.1,
        "fakes": [
          {
            "team": "us",
            "n": 1,
            "reps": 1
          },
          {
            "team": "us",
            "n": 4,
            "reps": 1
          },
          {
            "team": "us",
            "n": 5,
            "reps": 1
          },
          {
            "team": "us",
            "n": 8,
            "reps": 1
          }
        ]
      },
      {
        "label": "Step 4 — inside 5, 1: the two middles release",
        "summary": "throw at 5",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 4
            },
            "to": {
              "team": "them",
              "n": 5
            },
            "curve": -12
          },
          {
            "from": {
              "team": "us",
              "n": 5
            },
            "to": {
              "team": "them",
              "n": 5
            },
            "curve": 12
          }
        ]
      }
    ]
  },
  "insides-3": {
    "id": "insides-3",
    "name": "Inside — 3 balls",
    "badge": "3-ball",
    "call": "\"Inside 5, 1\"",
    "desc": "The three-ball version of Inside: the three ball-holders parley tightly in the middle and fan to the front line. The two middle holders throw at the same number — here the 5th from the left — after all three holders make one pump fake in unison.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": true
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": true
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": true
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders parley tightly in the middle",
        "summary": "parley: call play and choose target",
        "dur": 0.8,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              43.5,
              87
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              50,
              87
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.5,
              87
            ]
          }
        ]
      },
      {
        "label": "Step 2 — ball-holders fan to the front line",
        "summary": "to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              20.285714285714285,
              58
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              34,
              58
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              47.714285714285715,
              58
            ]
          }
        ]
      },
      {
        "label": "Step 3 — one pump fake in unison to pull the block",
        "summary": "1 pump fake",
        "dur": 1.1,
        "fakes": [
          {
            "team": "us",
            "n": 1,
            "reps": 1
          },
          {
            "team": "us",
            "n": 4,
            "reps": 1
          },
          {
            "team": "us",
            "n": 5,
            "reps": 1
          }
        ]
      },
      {
        "label": "Step 4 — inside 5, 1: the two middles release",
        "summary": "throw at 5",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 4
            },
            "to": {
              "team": "them",
              "n": 5
            },
            "curve": -12
          },
          {
            "from": {
              "team": "us",
              "n": 5
            },
            "to": {
              "team": "them",
              "n": 5
            },
            "curve": 12
          }
        ]
      }
    ]
  },
  "kill-left": {
    "id": "kill-left",
    "name": "Kill Left",
    "badge": "left kill",
    "call": "\"Kill left 2, 2\"",
    "desc": "The four ball-holders parley tightly in the middle, fan to the front line, then make two pump fakes in unison. The two left-side holders fire at the specified target — here their 2.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": true
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders parley tightly in the middle",
        "summary": "parley: call play and choose target",
        "dur": 0.8,
        "moves": [
          {
            "team": "us",
            "n": 3,
            "to": [
              40.25,
              87
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              46.75,
              87
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              53.25,
              87
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              59.75,
              87
            ]
          }
        ]
      },
      {
        "label": "Step 2 — ball-holders fan to the front line",
        "summary": "to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 3,
            "to": [
              29.42857142857143,
              58
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              43.142857142857146,
              58
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.857142857142854,
              58
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              70.57142857142857,
              58
            ]
          }
        ]
      },
      {
        "label": "Step 3 — two pump fakes in unison (freeze the defense)",
        "summary": "2 pump fakes",
        "dur": 1.2,
        "fakes": [
          {
            "team": "us",
            "n": 3,
            "reps": 2
          },
          {
            "team": "us",
            "n": 4,
            "reps": 2
          },
          {
            "team": "us",
            "n": 5,
            "reps": 2
          },
          {
            "team": "us",
            "n": 6,
            "reps": 2
          }
        ]
      },
      {
        "label": "Step 4 — kill left on 2: the two left holders release",
        "summary": "throw at 2",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 3
            },
            "to": {
              "team": "them",
              "n": 2
            },
            "curve": -12
          },
          {
            "from": {
              "team": "us",
              "n": 4
            },
            "to": {
              "team": "them",
              "n": 2
            },
            "curve": 12
          }
        ]
      }
    ]
  },
  "kill-left-3": {
    "id": "kill-left-3",
    "name": "Kill Left — 3 balls",
    "badge": "left kill",
    "call": "\"Kill left 2, 2\"",
    "desc": "Kill Left with three balls: the three ball-holders parley tightly in the middle and fan to the front line, then make two pump fakes before the two leftmost fire at their 2.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": true
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": true
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders parley tightly in the middle",
        "summary": "parley: call play and choose target",
        "dur": 0.8,
        "moves": [
          {
            "team": "us",
            "n": 3,
            "to": [
              43.5,
              87
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              50,
              87
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.5,
              87
            ]
          }
        ]
      },
      {
        "label": "Step 2 — ball-holders fan to the front line",
        "summary": "to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 3,
            "to": [
              29.428571428571423,
              58
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              43.14285714285714,
              58
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.857142857142854,
              58
            ]
          }
        ]
      },
      {
        "label": "Step 3 — two pump fakes in unison (freeze the defense)",
        "summary": "2 pump fakes",
        "dur": 1.2,
        "fakes": [
          {
            "team": "us",
            "n": 3,
            "reps": 2
          },
          {
            "team": "us",
            "n": 4,
            "reps": 2
          },
          {
            "team": "us",
            "n": 5,
            "reps": 2
          }
        ]
      },
      {
        "label": "Step 4 — kill left on 2: the two left holders release",
        "summary": "throw at 2",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 3
            },
            "to": {
              "team": "them",
              "n": 2
            },
            "curve": -12
          },
          {
            "from": {
              "team": "us",
              "n": 4
            },
            "to": {
              "team": "them",
              "n": 2
            },
            "curve": 12
          }
        ]
      }
    ]
  },
  "kill-right": {
    "id": "kill-right",
    "name": "Kill Right",
    "badge": "right kill",
    "call": "\"Kill right 7, 2\"",
    "desc": "The mirror of Kill Left: the four ball-holders parley tightly in the middle, fan to the front line, then make two pump fakes in unison. The two right-side holders fire at the specified target — here their 7.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders parley tightly in the middle",
        "summary": "parley: call play and choose target",
        "dur": 0.8,
        "moves": [
          {
            "team": "us",
            "n": 3,
            "to": [
              40.25,
              87
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              46.75,
              87
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              53.25,
              87
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              59.75,
              87
            ]
          }
        ]
      },
      {
        "label": "Step 2 — ball-holders fan to the front line",
        "summary": "to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 3,
            "to": [
              29.42857142857143,
              58
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              43.142857142857146,
              58
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.857142857142854,
              58
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              70.57142857142857,
              58
            ]
          }
        ]
      },
      {
        "label": "Step 3 — two pump fakes in unison (freeze the defense)",
        "summary": "2 pump fakes",
        "dur": 1.2,
        "fakes": [
          {
            "team": "us",
            "n": 3,
            "reps": 2
          },
          {
            "team": "us",
            "n": 4,
            "reps": 2
          },
          {
            "team": "us",
            "n": 5,
            "reps": 2
          },
          {
            "team": "us",
            "n": 6,
            "reps": 2
          }
        ]
      },
      {
        "label": "Step 4 — kill right on 7: the two right holders release",
        "summary": "throw at 7",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 5
            },
            "to": {
              "team": "them",
              "n": 7
            },
            "curve": -12
          },
          {
            "from": {
              "team": "us",
              "n": 6
            },
            "to": {
              "team": "them",
              "n": 7
            },
            "curve": 12
          }
        ]
      }
    ]
  },
  "kill-right-3": {
    "id": "kill-right-3",
    "name": "Kill Right — 3 balls",
    "badge": "right kill",
    "call": "\"Kill right 7, 2\"",
    "desc": "Kill Right with three balls: the three ball-holders parley tightly in the middle and fan to the front line, then make two pump fakes before the two rightmost fire at their 7.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": true
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders parley tightly in the middle",
        "summary": "parley: call play and choose target",
        "dur": 0.8,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              43.5,
              87
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              50,
              87
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              56.5,
              87
            ]
          }
        ]
      },
      {
        "label": "Step 2 — ball-holders fan to the front line",
        "summary": "to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              43.14285714285714,
              58
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.857142857142854,
              58
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              70.57142857142857,
              58
            ]
          }
        ]
      },
      {
        "label": "Step 3 — two pump fakes in unison (freeze the defense)",
        "summary": "2 pump fakes",
        "dur": 1.2,
        "fakes": [
          {
            "team": "us",
            "n": 4,
            "reps": 2
          },
          {
            "team": "us",
            "n": 5,
            "reps": 2
          },
          {
            "team": "us",
            "n": 6,
            "reps": 2
          }
        ]
      },
      {
        "label": "Step 4 — kill right on 7: the two right holders release",
        "summary": "throw at 7",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 5
            },
            "to": {
              "team": "them",
              "n": 7
            },
            "curve": -12
          },
          {
            "from": {
              "team": "us",
              "n": 6
            },
            "to": {
              "team": "them",
              "n": 7
            },
            "curve": 12
          }
        ]
      }
    ]
  },
  "middle": {
    "id": "middle",
    "name": "Middle",
    "badge": "1-ball defense",
    "call": "\"Middle\"",
    "desc": "Down to one ball: it goes to a player in the middle, who takes an offensive position to bait throws and win the ball back. They almost never throw that last ball.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": true
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": true
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": true
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "They bring it up; we pass to the middle",
        "summary": "to the middle · to the line · pass",
        "dur": 1,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              50,
              87
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              32.17142857142858,
              42
            ]
          },
          {
            "team": "them",
            "n": 3,
            "to": [
              45.885714285714286,
              42
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              59.6,
              42
            ]
          },
          {
            "team": "them",
            "n": 7,
            "to": [
              73.31428571428572,
              42
            ]
          },
          {
            "team": "them",
            "n": 8,
            "to": [
              87.02857142857142,
              42
            ]
          }
        ],
        "passes": [
          {
            "from": {
              "team": "us",
              "n": 1
            },
            "to": {
              "team": "us",
              "n": 4
            }
          }
        ]
      },
      {
        "label": "Bait — two of them bite, he dodges both",
        "summary": "throw at 4",
        "dur": 1.1,
        "throws": [
          {
            "from": {
              "team": "them",
              "n": 3
            },
            "to": {
              "team": "us",
              "n": 4
            },
            "outcome": "dodged",
            "curve": -12
          },
          {
            "from": {
              "team": "them",
              "n": 6
            },
            "to": {
              "team": "us",
              "n": 4
            },
            "outcome": "dodged",
            "curve": 12
          }
        ],
        "dodges": [
          {
            "team": "us",
            "n": 4
          },
          {
            "team": "us",
            "n": 4
          }
        ]
      }
    ]
  },
  "mirror": {
    "id": "mirror",
    "name": "Mirror",
    "badge": "3-ball defense",
    "call": "\"Mirror\"",
    "desc": "Our three ball-holders are spread across left, middle, and right on defense. Mirror is called against a one-ball attack: the first thrower triggers one matching defender, not the nearest player. The roles stay matched: left answers left, middle answers middle, and right answers right. Only their loaded attackers come forward; teammates without balls stay back. As our holders step to the line, their attackers fall back and only the matching holder fires. A multi-ball volley is a reset, not three mirror throws. Unlike Home and Away, no thrower is called — position decides.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": true
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": true
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Their loaded attackers take the line; middle shows",
        "summary": "to the line · 1 pump fake",
        "dur": 1,
        "moves": [
          {
            "team": "them",
            "n": 2,
            "to": [
              29.428571428571423,
              42
            ]
          },
          {
            "team": "them",
            "n": 4,
            "to": [
              43.14285714285714,
              42
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              56.857142857142854,
              42
            ]
          }
        ],
        "fakes": [
          {
            "team": "them",
            "n": 4,
            "reps": 1
          }
        ]
      },
      {
        "label": "Their middle throws",
        "summary": "throw at 4",
        "dur": 0.9,
        "throws": [
          {
            "from": {
              "team": "them",
              "n": 4
            },
            "to": {
              "team": "us",
              "n": 4
            },
            "outcome": "dodged",
            "curve": 14
          }
        ],
        "dodges": [
          {
            "team": "us",
            "n": 4
          }
        ]
      },
      {
        "label": "Their attackers fall back — we step up about halfway, middle answers middle",
        "summary": "to deep · throw at 4",
        "dur": 1.1,
        "moves": [
          {
            "team": "them",
            "n": 2,
            "to": [
              29.428571428571423,
              25
            ]
          },
          {
            "team": "them",
            "n": 4,
            "to": [
              43.14285714285714,
              25
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              56.857142857142854,
              25
            ]
          },
          {
            "team": "us",
            "n": 1,
            "to": [
              29.428571428571423,
              75
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              43.14285714285714,
              75
            ]
          },
          {
            "team": "us",
            "n": 7,
            "to": [
              56.857142857142854,
              75
            ]
          }
        ],
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 4
            },
            "to": {
              "team": "them",
              "n": 4
            }
          }
        ]
      }
    ]
  },
  "outsides": {
    "id": "outsides",
    "name": "Outsides",
    "badge": "4-ball",
    "call": "\"Outsides 4, 1\"",
    "desc": "Four-ball call. The four ball-holders parley tightly in the middle and fan to the front line. Both corners then throw at the same number from opposite angles after all four holders make one pump fake in unison to pull the block.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": true
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": true
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": true
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders parley tightly in the middle",
        "summary": "parley: call play and choose target",
        "dur": 0.8,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              40.25,
              87
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              46.75,
              87
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              53.25,
              87
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              59.75,
              87
            ]
          }
        ]
      },
      {
        "label": "Step 2 — ball-holders fan to the front line",
        "summary": "to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              29.42857142857143,
              58
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              43.142857142857146,
              58
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.857142857142854,
              58
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              70.57142857142857,
              58
            ]
          }
        ]
      },
      {
        "label": "Step 3 — one pump fake in unison to pull the block",
        "summary": "1 pump fake",
        "dur": 1.1,
        "fakes": [
          {
            "team": "us",
            "n": 1,
            "reps": 1
          },
          {
            "team": "us",
            "n": 4,
            "reps": 1
          },
          {
            "team": "us",
            "n": 5,
            "reps": 1
          },
          {
            "team": "us",
            "n": 8,
            "reps": 1
          }
        ]
      },
      {
        "label": "Step 4 — outsides 4, 1: the two corners release",
        "summary": "throw at 4",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 1
            },
            "to": {
              "team": "them",
              "n": 4
            },
            "curve": -12
          },
          {
            "from": {
              "team": "us",
              "n": 8
            },
            "to": {
              "team": "them",
              "n": 4
            },
            "curve": 12
          }
        ]
      }
    ]
  },
  "outsides-3": {
    "id": "outsides-3",
    "name": "Outsides — 3 balls",
    "badge": "3-ball",
    "call": "\"Outsides 4, 1\"",
    "desc": "The three-ball version of Outsides: the three ball-holders parley tightly in the middle and fan to the front line. Both corners throw at the same number from opposite angles after all three holders make one pump fake in unison.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": true
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": true
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": true
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": true
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": true
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders parley tightly in the middle",
        "summary": "parley: call play and choose target",
        "dur": 0.8,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              43.5,
              87
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              50,
              87
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              56.5,
              87
            ]
          }
        ]
      },
      {
        "label": "Step 2 — ball-holders fan to the front line",
        "summary": "to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              34,
              58
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              47.714285714285715,
              58
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              61.42857142857143,
              58
            ]
          }
        ]
      },
      {
        "label": "Step 3 — one pump fake in unison to pull the block",
        "summary": "1 pump fake",
        "dur": 1.1,
        "fakes": [
          {
            "team": "us",
            "n": 1,
            "reps": 1
          },
          {
            "team": "us",
            "n": 4,
            "reps": 1
          },
          {
            "team": "us",
            "n": 8,
            "reps": 1
          }
        ]
      },
      {
        "label": "Step 4 — outsides 4, 1: the two corners release",
        "summary": "throw at 4",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 1
            },
            "to": {
              "team": "them",
              "n": 4
            },
            "curve": -12
          },
          {
            "from": {
              "team": "us",
              "n": 8
            },
            "to": {
              "team": "them",
              "n": 4
            },
            "curve": 12
          }
        ]
      }
    ]
  },
  "pitch-back": {
    "id": "pitch-back",
    "name": "Pitch Back",
    "badge": "opening rush",
    "call": "\"Pitch back\"",
    "desc": "Opening rush. The two right players grab our three center-line balls (one grabs two, one grabs one), then pitch one back to an attacker who steps up to mid-court and picks off a backpedaling rusher.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": false
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": false
        }
      ],
      "balls": [
        {
          "id": "uR1",
          "x": 80,
          "y": 50,
          "side": "us"
        },
        {
          "id": "uR2",
          "x": 88,
          "y": 50,
          "side": "us"
        },
        {
          "id": "uR3",
          "x": 96,
          "y": 50,
          "side": "us"
        },
        {
          "id": "tL1",
          "x": 4,
          "y": 50,
          "side": "them"
        },
        {
          "id": "tL2",
          "x": 12,
          "y": 50,
          "side": "them"
        },
        {
          "id": "tL3",
          "x": 20,
          "y": 50,
          "side": "them"
        }
      ]
    },
    "steps": [
      {
        "label": "Rush — the two on the right grab our three (2 + 1)",
        "summary": "to the line · grab",
        "dur": 1.3,
        "moves": [
          {
            "team": "us",
            "n": 7,
            "to": [
              84.28571428571428,
              58
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              98,
              58
            ]
          },
          {
            "team": "them",
            "n": 1,
            "to": [
              2.000000000000001,
              42
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              15.714285714285715,
              42
            ]
          }
        ],
        "grabs": [
          {
            "team": "us",
            "n": 8,
            "balls": [
              "uR3",
              "uR2"
            ]
          },
          {
            "team": "us",
            "n": 7,
            "balls": [
              "uR1"
            ]
          },
          {
            "team": "them",
            "n": 1,
            "balls": [
              "tL1",
              "tL2"
            ]
          },
          {
            "team": "them",
            "n": 2,
            "balls": [
              "tL3"
            ]
          }
        ]
      },
      {
        "label": "Pitch back — attacker steps up",
        "summary": "to deep · move · pass",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 5,
            "to": [
              56.857142857142854,
              68
            ]
          },
          {
            "team": "them",
            "n": 1,
            "to": [
              2.000000000000001,
              25
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              15.714285714285715,
              25
            ]
          }
        ],
        "passes": [
          {
            "from": {
              "team": "us",
              "n": 8
            },
            "to": {
              "team": "us",
              "n": 5
            }
          }
        ]
      },
      {
        "label": "Free look — hit a regressing rusher",
        "summary": "fall back · throw at 2",
        "dur": 1,
        "moves": [
          {
            "team": "them",
            "n": 1,
            "to": [
              2.000000000000001,
              5
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              15.714285714285715,
              5
            ]
          }
        ],
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 5
            },
            "to": {
              "team": "them",
              "n": 2
            }
          }
        ]
      }
    ]
  },
  "three-ball": {
    "id": "three-ball",
    "name": "3 Balls",
    "badge": "3-ball",
    "call": "\"meet in the middle\"",
    "desc": "With three balls the three ball-holders parley tightly in the middle, then fan across the front line. Everyone with a ball pump-fakes in unison; the two designated throwers then attack a specific target.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 2,
          "y": 95,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 95,
          "ball": false
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 95,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 95,
          "ball": true
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 95,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 95,
          "ball": true
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 95,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 95,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 2,
          "y": 5,
          "ball": false
        },
        {
          "n": 2,
          "x": 15.714285714285714,
          "y": 5,
          "ball": true
        },
        {
          "n": 3,
          "x": 29.428571428571427,
          "y": 5,
          "ball": false
        },
        {
          "n": 4,
          "x": 43.14285714285714,
          "y": 5,
          "ball": false
        },
        {
          "n": 5,
          "x": 56.857142857142854,
          "y": 5,
          "ball": true
        },
        {
          "n": 6,
          "x": 70.57142857142857,
          "y": 5,
          "ball": false
        },
        {
          "n": 7,
          "x": 84.28571428571428,
          "y": 5,
          "ball": false
        },
        {
          "n": 8,
          "x": 98,
          "y": 5,
          "ball": true
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders parley tightly in the middle",
        "summary": "parley: call play and choose target",
        "dur": 0.8,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              43.5,
              87
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              50,
              87
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              56.5,
              87
            ]
          }
        ]
      },
      {
        "label": "Step 2 — ball-holders fan to the front line",
        "summary": "to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              43.14285714285714,
              58
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56.857142857142854,
              58
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              70.57142857142857,
              58
            ]
          }
        ]
      },
      {
        "label": "Step 3 — everyone with a ball pump-fakes",
        "summary": "1 pump fake",
        "dur": 1.1,
        "fakes": [
          {
            "team": "us",
            "n": 4,
            "reps": 1
          },
          {
            "team": "us",
            "n": 5,
            "reps": 1
          },
          {
            "team": "us",
            "n": 6,
            "reps": 1
          }
        ]
      },
      {
        "label": "Step 4 — two throwers on 4",
        "summary": "throw at 4",
        "dur": 1,
        "throws": [
          {
            "from": {
              "team": "us",
              "n": 4
            },
            "to": {
              "team": "them",
              "n": 4
            },
            "curve": -12
          },
          {
            "from": {
              "team": "us",
              "n": 5
            },
            "to": {
              "team": "them",
              "n": 4
            },
            "curve": 12
          }
        ]
      }
    ]
  }
}; })(typeof window!=="undefined"?window:globalThis);
