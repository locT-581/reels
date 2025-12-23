```
flowchart TB
    subgraph target [Target Architecture]
        direction TB
        T_embed[embed]
        T_feed[feed]
        T_player[player]
        T_ui[ui]
        T_gestures[gestures]
        T_playerCore[player-core]
        T_engine[player-engine]
        T_core[core]
        T_tokens[design-tokens]
        T_types[types]
        
        T_embed --> T_feed
        T_embed --> T_player
        
        T_feed --> T_core
        T_feed --> T_player
        T_feed --> T_gestures
        
        T_player --> T_playerCore
        T_player --> T_ui
        
        T_playerCore --> T_engine
        T_playerCore --> T_types
        
        T_engine --> T_types
        
        T_ui --> T_tokens
        T_ui --> T_types
        
        T_gestures --> T_types
        
        T_core --> T_types
        T_core --> T_tokens
        
        T_tokens --> T_types
    end
```
