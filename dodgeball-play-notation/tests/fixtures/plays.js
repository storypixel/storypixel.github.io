/* GOLDEN FIXTURE (8-a-side) — snapshot of the parser output for the example
 * plays. Regenerated intentionally; the parity test compares parser output to
 * this so behavioral regressions are caught. Regenerate with tests/gen-golden.js. */
(function(g){ g.DB_PLAYS = {
  "away": {
    "id": "away",
    "name": "Away",
    "badge": "3-ball defense",
    "call": "\"Away\"",
    "desc": "We're holding three balls on defense. They attack the line first; when they throw we rush — as they retreat off the line, our three ball-holders surge forward and counter the thrower on the run.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 8,
          "y": 90,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": true
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": true
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "They bring it up to the line",
        "dur": 1,
        "moves": [
          {
            "team": "them",
            "n": 2,
            "to": [
              20,
              45
            ]
          },
          {
            "team": "them",
            "n": 4,
            "to": [
              44,
              45
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              68,
              45
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
        "label": "We rush as they retreat — and counter",
        "dur": 1.2,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              44,
              55
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56,
              55
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              68,
              55
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              20,
              25
            ]
          },
          {
            "team": "them",
            "n": 4,
            "to": [
              44,
              25
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              68,
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
    "call": "\"Home\"",
    "desc": "We're holding three balls on defense. They bring their balls up to the line to attack; the designated defender reads the throw and pre-counters — releasing first, from their own position, to hit the thrower before their ball lands.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 8,
          "y": 90,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": true
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": true
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "They bring it up to the line",
        "dur": 1,
        "moves": [
          {
            "team": "them",
            "n": 2,
            "to": [
              20,
              45
            ]
          },
          {
            "team": "them",
            "n": 4,
            "to": [
              44,
              45
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              68,
              45
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
    "name": "Insides",
    "badge": "4-ball offense",
    "call": "\"Insides on 5\"",
    "desc": "Four-ball call. The two middle players throw at the same number — here the 5th from the left — while the corners hold the other two balls and pump-fake to pull the block.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 8,
          "y": 90,
          "ball": true
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": true
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": false
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": true
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": true
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": false
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": false
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": true
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders step up to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              8,
              55
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              44,
              55
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56,
              55
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              92,
              55
            ]
          }
        ]
      },
      {
        "label": "Step 2 — corners pump-fake to pull the block",
        "dur": 1.1,
        "fakes": [
          {
            "team": "us",
            "n": 1,
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
        "label": "Step 3 — insides on 5: the two middles release",
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
    "desc": "The two left-side ball-holders throw at one specified target after the whole line pump-fakes in unison. Called as \"kill left <target>, <pump-fakes>\" — here the two leftmost holders fire at their 2 on the count after two pump-fakes.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 8,
          "y": 90,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": true
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": true
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": true
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": false
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": false
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": true
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders step up to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 3,
            "to": [
              32,
              55
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              44,
              55
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56,
              55
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              68,
              55
            ]
          }
        ]
      },
      {
        "label": "Step 2 — two pump-fakes in unison (freeze the defense)",
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
        "label": "Step 3 — kill left on 2: the two left holders release",
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
    "desc": "The mirror of Kill Left: the two right-side ball-holders throw at one specified target after the whole line pump-fakes in unison. Called as \"kill right <target>, <pump-fakes>\" — here the two rightmost holders fire at their 7 on the count after two pump-fakes.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 8,
          "y": 90,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": true
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": true
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": true
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": false
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders step up to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 3,
            "to": [
              32,
              55
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              44,
              55
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56,
              55
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              68,
              55
            ]
          }
        ]
      },
      {
        "label": "Step 2 — two pump-fakes in unison (freeze the defense)",
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
        "label": "Step 3 — kill right on 7: the two right holders release",
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
          "x": 8,
          "y": 90,
          "ball": true
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": false
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": false
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": true
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": true
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": false
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": true
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
          "ball": true
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "They bring it up; we pass to the middle",
        "dur": 1,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              44,
              65
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              20,
              45
            ]
          },
          {
            "team": "them",
            "n": 3,
            "to": [
              32,
              45
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              68,
              45
            ]
          },
          {
            "team": "them",
            "n": 7,
            "to": [
              80,
              45
            ]
          },
          {
            "team": "them",
            "n": 8,
            "to": [
              92,
              45
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
        "label": "Bait — they bite, he dodges",
        "dur": 1.1,
        "throws": [
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
            "curve": 14
          }
        ],
        "dodges": [
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
    "desc": "We're holding three balls on defense. They set at the line to throw; the defender directly opposite the thrower has the green light. Our ball-holders step up to the line as the opposite defender fires straight back.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 8,
          "y": 90,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": true
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": true
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "They set at the line",
        "dur": 1,
        "moves": [
          {
            "team": "them",
            "n": 2,
            "to": [
              20,
              45
            ]
          },
          {
            "team": "them",
            "n": 4,
            "to": [
              44,
              45
            ]
          },
          {
            "team": "them",
            "n": 6,
            "to": [
              68,
              45
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
        "label": "Mirror — our line steps up, opposite defender throws back",
        "dur": 1,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              44,
              55
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56,
              55
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              68,
              55
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
    "badge": "4-ball offense",
    "call": "\"Outsides on 4\"",
    "desc": "Four-ball call. Both corners throw at the same number from opposite angles, so no single block covers both balls, while the middle two hold and pump-fake to pull the block.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 8,
          "y": 90,
          "ball": true
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": true
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": false
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": true
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": true
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": false
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": false
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": true
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
          "ball": false
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — ball-holders step up to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 1,
            "to": [
              8,
              55
            ]
          },
          {
            "team": "us",
            "n": 4,
            "to": [
              44,
              55
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56,
              55
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              92,
              55
            ]
          }
        ]
      },
      {
        "label": "Step 2 — middles pump-fake to pull the block",
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
          }
        ]
      },
      {
        "label": "Step 3 — outsides on 4: the two corners release",
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
          "x": 8,
          "y": 90,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": false
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": false
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": false
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": false
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": false
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
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
        "dur": 1.3,
        "moves": [
          {
            "team": "us",
            "n": 7,
            "to": [
              80,
              55
            ]
          },
          {
            "team": "us",
            "n": 8,
            "to": [
              92,
              55
            ]
          },
          {
            "team": "them",
            "n": 1,
            "to": [
              8,
              45
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              20,
              45
            ]
          }
        ],
        "grabs": [
          {
            "team": "us",
            "n": 8,
            "balls": [
              "uR2",
              "uR3"
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
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 5,
            "to": [
              56,
              68
            ]
          },
          {
            "team": "them",
            "n": 1,
            "to": [
              8,
              25
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              20,
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
        "dur": 1,
        "moves": [
          {
            "team": "them",
            "n": 1,
            "to": [
              8,
              10
            ]
          },
          {
            "team": "them",
            "n": 2,
            "to": [
              20,
              10
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
    "badge": "3-ball offense",
    "call": "\"meet in the middle\"",
    "desc": "With three balls we meet in the middle and step up to the line, then designate one or two throwers on a specific target. The odd man out pump-fakes.",
    "setup": {
      "us": [
        {
          "n": 1,
          "x": 8,
          "y": 90,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 90,
          "ball": false
        },
        {
          "n": 3,
          "x": 32,
          "y": 90,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 90,
          "ball": true
        },
        {
          "n": 5,
          "x": 56,
          "y": 90,
          "ball": true
        },
        {
          "n": 6,
          "x": 68,
          "y": 90,
          "ball": true
        },
        {
          "n": 7,
          "x": 80,
          "y": 90,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 90,
          "ball": false
        }
      ],
      "them": [
        {
          "n": 1,
          "x": 8,
          "y": 10,
          "ball": false
        },
        {
          "n": 2,
          "x": 20,
          "y": 10,
          "ball": true
        },
        {
          "n": 3,
          "x": 32,
          "y": 10,
          "ball": false
        },
        {
          "n": 4,
          "x": 44,
          "y": 10,
          "ball": false
        },
        {
          "n": 5,
          "x": 56,
          "y": 10,
          "ball": true
        },
        {
          "n": 6,
          "x": 68,
          "y": 10,
          "ball": false
        },
        {
          "n": 7,
          "x": 80,
          "y": 10,
          "ball": false
        },
        {
          "n": 8,
          "x": 92,
          "y": 10,
          "ball": true
        }
      ],
      "balls": []
    },
    "steps": [
      {
        "label": "Step 1 — meet in the middle, step to the line",
        "dur": 0.9,
        "moves": [
          {
            "team": "us",
            "n": 4,
            "to": [
              48,
              55
            ]
          },
          {
            "team": "us",
            "n": 5,
            "to": [
              56,
              55
            ]
          },
          {
            "team": "us",
            "n": 6,
            "to": [
              64,
              55
            ]
          }
        ]
      },
      {
        "label": "Step 2 — the odd man pump-fakes",
        "dur": 1.1,
        "fakes": [
          {
            "team": "us",
            "n": 6,
            "reps": 1
          }
        ]
      },
      {
        "label": "Step 3 — two throwers on 4",
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
