import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    'ach-first-blood': {
                        table: 'x_doom_achievement'
                        id: 'f4147a0904bc428eb07070ded54719e4'
                    }
                    'ach-five-figures': {
                        table: 'x_doom_achievement'
                        id: '62a8abc5769f49b6b50e183a13fd9f77'
                    }
                    'ach-hangar': {
                        table: 'x_doom_achievement'
                        id: '01556d33a0d94de9a94113ae51e9082d'
                    }
                    'ach-marathon': {
                        table: 'x_doom_achievement'
                        id: '3d1e28415cd74b85b5c8cbcf1394fa6a'
                    }
                    'ach-perfectionist': {
                        table: 'x_doom_achievement'
                        id: 'b565fde13631490b93bb5ff8e013d670'
                    }
                    'ach-rip-tear': {
                        table: 'x_doom_achievement'
                        id: '33940a6e8c0849d3b52cf023f1a8127a'
                    }
                    'ach-secret-agent': {
                        table: 'x_doom_achievement'
                        id: '7f044ce135194bcba6c5838ad9e665f3'
                    }
                    'ach-slayer': {
                        table: 'x_doom_achievement'
                        id: '7d0daf0078be497d81a52cc9b1f4e243'
                    }
                    'ach-speed-demon': {
                        table: 'x_doom_achievement'
                        id: '34b896cf98bb4fe78fd33c1e486e2283'
                    }
                    'ach-trigger': {
                        table: 'x_doom_achievement'
                        id: 'fce3ca6e716a476e925efae73e8c3fbc'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: 'ecbd94e39d5648ec866347dd25aae3ca'
                    }
                    'br-player-callsign': {
                        table: 'sys_script'
                        id: '617eefa7293e45c8a626a85785b03819'
                    }
                    'br-player-rank': {
                        table: 'sys_script'
                        id: '8ad3bac4b9b641059bced25c026c6710'
                    }
                    'br-run-complete': {
                        table: 'sys_script'
                        id: '3c568e5ca51e43e3af9d1e705e59ef85'
                    }
                    'br-run-lock': {
                        table: 'sys_script'
                        id: '9353ed149dc141ed89912e2349d35c4e'
                    }
                    'menu-doom': {
                        table: 'sys_app_application'
                        id: '3f8d676207ac4355a2684ad12351440f'
                    }
                    'mod-achievements': {
                        table: 'sys_app_module'
                        id: 'bb45bcb6e8d04d45be007376b218d87e'
                    }
                    'mod-all-runs': {
                        table: 'sys_app_module'
                        id: 'f2504c1a53b34d94b079ecd937cef6e6'
                    }
                    'mod-doomguy': {
                        table: 'sys_app_module'
                        id: 'd895099aa66349eaa27b814871cab5bf'
                    }
                    'mod-earned': {
                        table: 'sys_app_module'
                        id: '17f19f0260724e86af096ad21e315123'
                    }
                    'mod-leaderboard': {
                        table: 'sys_app_module'
                        id: '057339a1d2204bcc81912a4aaa9eeec1'
                    }
                    'mod-level-stats': {
                        table: 'sys_app_module'
                        id: '7a3ce8cd6d7c4f3a991d13e60372c79e'
                    }
                    'mod-my-runs': {
                        table: 'sys_app_module'
                        id: '40415900ea014090b4b978a8224a1978'
                    }
                    'mod-play': {
                        table: 'sys_app_module'
                        id: '2527a1375ede4337a40f35aad8b2de69'
                    }
                    'mod-players': {
                        table: 'sys_app_module'
                        id: '6c749ab17fe54172ad79f7b8b348c7c4'
                    }
                    'mod-sep-config': {
                        table: 'sys_app_module'
                        id: '3f0453e3d9fd4ab7892be47d70174ffa'
                    }
                    'mod-sep-records': {
                        table: 'sys_app_module'
                        id: 'a5fcb5a38dd042009a8f4b74a2d2bc18'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '6f5fbe90a0db49e990e981a5458692c4'
                    }
                    'prop-doomguy-default': {
                        table: 'sys_properties'
                        id: 'aaf78b7f089040cc86e0a120f09958ac'
                    }
                    'prop-min-level-seconds': {
                        table: 'sys_properties'
                        id: '3f76b3d60f334415b4b63730a0f75414'
                    }
                    'prop-reject-suspect': {
                        table: 'sys_properties'
                        id: '9679317101dd47b3b312e2e54302e222'
                    }
                    'rest-doom': {
                        table: 'sys_ws_definition'
                        id: '643a60181afd41959e4357a0310f7d08'
                    }
                    'rest-doomguy-get': {
                        table: 'sys_ws_operation'
                        id: 'a3d0eb8f2f5b4f60b4e4a73cfd6c3904'
                    }
                    'rest-doomguy-put': {
                        table: 'sys_ws_operation'
                        id: 'edcb25f744b64462962baf9b36ec3db6'
                    }
                    'rest-doomguy-telemetry': {
                        table: 'sys_ws_operation'
                        id: '31cbe9a954064c869027196d8288c618'
                    }
                    'rest-leaderboard': {
                        table: 'sys_ws_operation'
                        id: 'b4c5e26c77484334a89bef25def374a4'
                    }
                    'rest-leaderboard-limit': {
                        table: 'sys_ws_query_parameter'
                        id: 'db293a08860c4151bbb4a0de0240cf41'
                    }
                    'rest-me': {
                        table: 'sys_ws_operation'
                        id: '36908cdbdc35406d86cb6f57bd591e7c'
                    }
                    'rest-run-abandon': {
                        table: 'sys_ws_operation'
                        id: '5d0fdb1ad196409b895ad7dffb6da78b'
                    }
                    'rest-run-finish': {
                        table: 'sys_ws_operation'
                        id: '7ec228a61d0745e9bd24bd142e3350c6'
                    }
                    'rest-run-start': {
                        table: 'sys_ws_operation'
                        id: '4ac1a8e34a104a3ea1c361aa502f0cb7'
                    }
                    src_server_doom_achievements_ts: {
                        table: 'sys_module'
                        id: '7483e28b66314651a6180e7fd7d886af'
                    }
                    src_server_doom_api_ts: {
                        table: 'sys_module'
                        id: '1ee2ed00f5b44dcbab37fb2de036ac13'
                    }
                    src_server_doom_players_ts: {
                        table: 'sys_module'
                        id: '9eabc54359944c2d99541f48c5083672'
                    }
                    src_server_doom_rules_ts: {
                        table: 'sys_module'
                        id: '315cf515ea064551ab9c56c9fe5b4172'
                    }
                    src_server_doom_scoring_ts: {
                        table: 'sys_module'
                        id: '88c780503dc54d33aee4a9dbd39681fb'
                    }
                    src_server_doom_types_ts: {
                        table: 'sys_module'
                        id: '13fa795d0e3945138191ba17e8fae9b9'
                    }
                    'ui-script-doomguy-loader': {
                        table: 'sys_ui_script'
                        id: '269dfaa92db34e5995504aecbe649a32'
                    }
                    'x_doom_achievement-create': {
                        table: 'sys_security_acl'
                        id: '7e81f9bfa7c6401e8aa4a575306f2cfa'
                    }
                    'x_doom_achievement-delete': {
                        table: 'sys_security_acl'
                        id: 'dc9b71903ed144fc981ac63014f45a04'
                    }
                    'x_doom_achievement-read': {
                        table: 'sys_security_acl'
                        id: '19a25cfef7914bf6a9410ede7b450a93'
                    }
                    'x_doom_achievement-write': {
                        table: 'sys_security_acl'
                        id: '03693cb8bd904cbfa67cc825d2280b1f'
                    }
                    'x_doom_level_stat-create': {
                        table: 'sys_security_acl'
                        id: 'e3e1dcf918564c25a37b4e57f9f4bc27'
                    }
                    'x_doom_level_stat-delete': {
                        table: 'sys_security_acl'
                        id: 'c81abaa3cbbe4bde9396b863c9182db8'
                    }
                    'x_doom_level_stat-read': {
                        table: 'sys_security_acl'
                        id: '3eb357ee4e0448e3bd8321f609aede43'
                    }
                    'x_doom_level_stat-write': {
                        table: 'sys_security_acl'
                        id: '806b058734a14d8ca885e6b8c0ad2e60'
                    }
                    'x_doom_player_achievement-create': {
                        table: 'sys_security_acl'
                        id: '92caef1961c545c78f5113acec7a1f3c'
                    }
                    'x_doom_player_achievement-delete': {
                        table: 'sys_security_acl'
                        id: 'ab9754d430ff4f119242ed38084224df'
                    }
                    'x_doom_player_achievement-read': {
                        table: 'sys_security_acl'
                        id: '7bd1f27a0b3941f2912d21a88d0a9ea0'
                    }
                    'x_doom_player_achievement-write': {
                        table: 'sys_security_acl'
                        id: '751f6dceabf64b0893f904d68e3cf029'
                    }
                    'x_doom_player-create': {
                        table: 'sys_security_acl'
                        id: 'fa56a93164454695b1aa38e291fa568e'
                    }
                    'x_doom_player-delete': {
                        table: 'sys_security_acl'
                        id: '3018d231696047488e4439ef1ab67c50'
                    }
                    'x_doom_player-read': {
                        table: 'sys_security_acl'
                        id: '48baddcd9f3f49eeb9decf90fd4ccd22'
                    }
                    'x_doom_player-write': {
                        table: 'sys_security_acl'
                        id: '5494a0caf4ec42bc8dc92ae80dcc4e29'
                    }
                    'x_doom_run-create': {
                        table: 'sys_security_acl'
                        id: '2fe06e4b800642c7a338ce0ae66fef92'
                    }
                    'x_doom_run-delete': {
                        table: 'sys_security_acl'
                        id: 'a7f818c22398496c8e82ca765ef3ff34'
                    }
                    'x_doom_run-read': {
                        table: 'sys_security_acl'
                        id: '5bcb20c942974ea1aaea42851b367ca2'
                    }
                    'x_doom_run-write': {
                        table: 'sys_security_acl'
                        id: '45f839e117af48f7a4e1ee552117de7d'
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '00d9b680003240bdaf05cc94827c9129'
                        key: {
                            name: 'x_doom_player'
                            element: 'last_played'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '013205125d354b5181fc125bedefab78'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'sort_order'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0260b6942fea475ca1496c319b98cadb'
                        key: {
                            name: 'x_doom_run'
                            element: 'duration_seconds'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0296489ef6e74143be58ccc0bb1a0d0c'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '039529b13fb346e8aebc9fdb72161235'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '051f08933ea04db2a4ad11742b794541'
                        key: {
                            list_id: {
                                id: 'a3649b96dfe64925a37639b7f3484042'
                                key: {
                                    name: 'x_doom_player'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'total_kills'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '05d536e1653f4e4fb56adf2bcd04754a'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '05ed37af04284c83938699601e647e3f'
                        key: {
                            name: 'x_doom_level_stat'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '07557b87111547789b349522194db37d'
                        key: {
                            name: 'x_doom_player_achievement'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '078f904c271b4f5fafdc5b28cd44192a'
                        key: {
                            sys_security_acl: '2fe06e4b800642c7a338ce0ae66fef92'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '08122b4f7d4c42fd867487bb311b2fac'
                        key: {
                            name: 'x_doom_player'
                            element: 'rank_title'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '09303caa87624b878e52f8cf86b4236d'
                        key: {
                            name: 'x_doom_run'
                            element: 'levels_completed'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '0a24cd8f3105490d8468d377a7e29d7e'
                        key: {
                            name: 'x_doom_player'
                            caption: 'Marine'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0aecab0ed22644ff81c5fa367495ca8b'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'run_kills'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0ce7bbdd7727475dbda1ef4037f218ea'
                        key: {
                            name: 'x_doom_player'
                            element: 'runs_completed'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0d1c1dfad744487aac79e90cdbaef4c5'
                        key: {
                            name: 'x_doom_run'
                            element: 'state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '0d6f07de4f7748bc9ef562116f176717'
                        key: {
                            name: 'x_doom_player'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '0dd86da5c7c84d419dc3c1e770598126'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '22'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0fb00488fe22435cb3a73e3e3eb3959c'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'items'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '0ff7b40fb4c34d25baf5f293fbfcb674'
                        key: {
                            list_id: {
                                id: '6f6df11da4d844f694d8139d9d335fdb'
                                key: {
                                    name: 'x_doom_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'threshold'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1073221133e548f3966a58c62b6c795c'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kills_max'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '12513c32c33b411dae4234e12d0c04ed'
                        key: {
                            name: 'x_doom_run'
                            caption: 'Run'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '135f4938cc1946ca86e33c00ee4cd117'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '141429e2c52945f78052180afd444cd7'
                        key: {
                            name: 'x_doom_run'
                            element: 'skill'
                            value: '4'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '14f4b57ad63f485e9fbee34f4a9307a1'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1597c086fd20402ebfe224179a0293ba'
                        key: {
                            sys_security_acl: '5494a0caf4ec42bc8dc92ae80dcc4e29'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1654a0110f394e0f82142070ebb475e4'
                        key: {
                            name: 'x_doom_run'
                            element: 'player'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1714086a6767432fa3031ced591635c6'
                        key: {
                            sys_security_acl: '03693cb8bd904cbfa67cc825d2280b1f'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '17f43ab0a65d4a07b8256a3df322a558'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'levels_completed'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '180117bf1d9f48799c1db94ae13f6766'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '18c59e6d7cd14022b3d0f48ae31d9655'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'secrets'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '18dd82cfdaa740cdbb3fc80dea1d1031'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'secrets_max'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '1956b6337ee74bc8a0050a66bcba07d5'
                        key: {
                            list_id: {
                                id: '6f6df11da4d844f694d8139d9d335fdb'
                                key: {
                                    name: 'x_doom_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'code'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1ac9ed0b028e4857b4b378513a77bd87'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'secrets'
                            position: '16'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1b2b016bf6cd46d6bea74e6bdc64f058'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'state'
                            position: '3'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '1bb0880f6f2f46d3839b4eee78bdffef'
                        key: {
                            application_file: 'd7fb3617fa444b169e00b3978de7ae6f'
                            source_artifact: '3a8a614bdb4548d2acea748242c0d405'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1bbfaaeaa52c49bbab766215156cf0f2'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'started_at'
                            position: '7'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '1dcaa0d9f6e74e64a059ed8bcb003e5c'
                        key: {
                            application_file: '5c1352b686ba4b81b0e36c28e726ed93'
                            source_artifact: '3249a146819640799dc67c997e3001f3'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1e1d0501e611494f83f3456c9361573c'
                        key: {
                            sys_security_acl: 'dc9b71903ed144fc981ac63014f45a04'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1e32acf028824674b8587d05fc1639f5'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '1eacbf31828b4a6798fc727fd9f0a508'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1f4217f6e0c847e6acdcc3b2310bc526'
                        key: {
                            name: 'x_doom_run'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '2025d20ebb874f878d95eb94a40166a9'
                        key: {
                            name: 'x_doom_player'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '206c8920d64e4ec6beedd0f91c8281fa'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'time_seconds'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '20ef5e5beb7a4f1c97ee1942c548ef17'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'kills_max'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2115bfadaaee4e299a3cf651c471d155'
                        key: {
                            sys_security_acl: '7e81f9bfa7c6401e8aa4a575306f2cfa'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '234b325b96734f1f9b5914c04ae8d521'
                        key: {
                            sys_security_acl: '806b058734a14d8ca885e6b8c0ad2e60'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '239dc575080442609c1722ae0f56cea6'
                        key: {
                            name: 'x_doom_run'
                            element: 'skill'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '240f7a38ff5e4f72bae6f2db77476517'
                        key: {
                            name: 'x_doom_player'
                            element: 'total_kills'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2461ce8a589d4704adcd2036ecfb9002'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'total_kills'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '25bb20c02aca4f1880b1a08f2172bbb0'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '2896ab61bf7e4368bf18bde966751216'
                        key: {
                            list_id: {
                                id: '835c9c11ed0e48f6b87928cd6c3cd837'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'map'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '290b02ed7ac14f708ffe7e17495bd1e7'
                        key: {
                            name: 'x_doom_run'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '29b19710532a453e97a8288d36251c9a'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'integrity_notes'
                            position: '20'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '29dbec50d3aa4a71960fac8c2b3d3595'
                        key: {
                            name: 'x_doom/doomguy.js.map'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '29fbc643488641d6b0108a25a14937ed'
                        key: {
                            name: 'x_doom_run'
                            element: 'score'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2aa3ebfacd2b4f7ca2522c4beb3840f2'
                        key: {
                            name: 'x_doom_player'
                            element: 'best_score'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2b0a215494b3422cb1b9b374c1b55707'
                        key: {
                            name: 'x_doom_run'
                            element: 'integrity_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2b0c4d16f698463599b29e39851b8070'
                        key: {
                            sys_security_acl: 'c81abaa3cbbe4bde9396b863c9182db8'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '2babc473b1dc489ca65ee05bc94e1868'
                        key: {
                            sys_ui_form: {
                                id: '9921e6f40acc453c96aaa92375f5725d'
                                key: {
                                    name: 'x_doom_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2be48c6afd564fc88fcbbfb2bda385f1'
                        key: {
                            name: 'x_doom_run'
                            element: 'levels_completed'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2c5bb5a8f254471e965cdb04f591eef0'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'score'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2c87ab7401ca43e68240e710cf9a6bd8'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2d0ddd84e33b45b99e35420d632e95e0'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'player'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '2d251aa451034f1bb4cdd940ac217174'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'duration_seconds'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '301d7f9d239342eba46f48c03d6be617'
                        key: {
                            name: 'x_doom_run'
                            element: 'skill'
                            value: '2'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '31129858977e47a8aa83c669743275a6'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'callsign'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3136cb3e2ab14227b623f0a52e8cd37d'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '19'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '31af847dda3946e9a4e977387bf554a9'
                        key: {
                            name: 'x_doom_player'
                            element: 'total_items'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '31f2bd7ec5d349399bb4479292ed26e6'
                        key: {
                            list_id: {
                                id: 'a3649b96dfe64925a37639b7f3484042'
                                key: {
                                    name: 'x_doom_player'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'runs_completed'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '321ad6c50111460c809aa8202e3607ec'
                        key: {
                            list_id: {
                                id: 'a3649b96dfe64925a37639b7f3484042'
                                key: {
                                    name: 'x_doom_player'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'last_played'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '3249a146819640799dc67c997e3001f3'
                        key: {
                            name: 'x_doom_doomguy.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '32a53bbac2ae4e4588a2f996a48c0c11'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'episode'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '32b7f04f38584ce79f8154662daf2dda'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'items'
                            position: '14'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '33424b4290bc4b7d938afdec43e39097'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'perfect_levels'
                            position: '16'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '353ef963179f4991b873cac5287ce460'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'threshold'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '35501fd26782475b9196c09abc852a5b'
                        key: {
                            name: 'x_doom_player'
                            element: 'par_beaten'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '35db94932f65487da09cd54e324ef2d1'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'total_items'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '385c12f6c0e64771bce01c8f487dd8ed'
                        key: {
                            name: 'x_doom_achievement'
                            caption: 'Achievement'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '38ffc790c087432c9142d6fa59c0fdfb'
                        key: {
                            name: 'x_doom/game-cfg.js.map'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '39b39f1a1411473ca5b29fb16466905a'
                        key: {
                            name: 'x_doom_run'
                            element: 'ended_at'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '3a8a614bdb4548d2acea748242c0d405'
                        key: {
                            name: 'x_doom_play.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3ac5d95006cb4f3095a553f7e5ce9ab7'
                        key: {
                            sys_ui_section: {
                                id: '99cf9ee004be4564a5554887a4433907'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    caption: 'Earned'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3b93b6fd44354e6c9010df02f89aec43'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'kills'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3c64b07badac464694f8e7cbae66f0c0'
                        key: {
                            sys_ui_section: {
                                id: '99cf9ee004be4564a5554887a4433907'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    caption: 'Earned'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3d97d86f9ffc42939846cf36831d749d'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'secrets_max'
                            position: '12'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3e2a6acfaaa449c593e7944435959d50'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3eb654c1a19c487c90564c23eab2f4a4'
                        key: {
                            name: 'x_doom_run'
                            element: 'integrity'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '3f60fae743cb4130a155ad34c4dff9cd'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'total_score'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3fc15b14de1447588951d24ea50b120d'
                        key: {
                            name: 'x_doom_run'
                            element: 'ended_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '405d9a9571e14c0697d52ea1c217f0d2'
                        key: {
                            name: 'x_doom_run'
                            element: 'integrity'
                            value: 'suspect'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4084dcf8ea7a46ffa714df7f56c4e898'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'run'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '40b88688c50e403fa727d9def841fe42'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '24'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4143f99d98744f54a80c115a3ed58b60'
                        key: {
                            name: 'x_doom_player'
                            element: 'best_score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '41540bfa6cf74692ba7e144a205050b0'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'active'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '41da9673535b467293b7985b251bb660'
                        key: {
                            name: 'x_doom_run'
                            element: 'items'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: '42e781c9bf494b8ca79e8661caed152f'
                        key: {
                            name: 'x_doom_player_achievement'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '431356309fdc47b5aa494296deae89df'
                        key: {
                            name: 'x_doom_player'
                            element: 'par_beaten'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '43eab49e65af4405baf0f78e6f70e908'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'runs_completed'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '45c4b2ca12eb4c138c34c861dedd897e'
                        key: {
                            name: 'x_doom_run'
                            element: 'duration_seconds'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '45d24ea8cbf04ef19773ec08c3b9df58'
                        key: {
                            name: 'x_doom_run'
                            element: 'integrity'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '460a3cc0889341cbb7a68463f632e5cc'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '10'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '463df7e92cdd4fb4adc9d37fa98167be'
                        key: {
                            name: 'x_doom_level_stat'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '46595d1336bc4495b27de29695f3d75e'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'description'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4681d4b14583430ea378a039841d6fec'
                        key: {
                            name: 'x_doom_player'
                            element: 'user'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '47089595c03543e2a9edacf8184c05ef'
                        key: {
                            list_id: {
                                id: '6e4b6fac146e41a4afa2cc38adc593fc'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'levels_completed'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '48eab23eb2ab4d50be701e881ca815c0'
                        key: {
                            name: 'x_doom/doom'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '496c43b15d5a4a1a90f715eda6b276d1'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4a261b8ada1f49698b0ac94ad9bf17b8'
                        key: {
                            name: 'x_doom_player'
                            element: 'total_secrets'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4a72b78609bf4308bb8b59ca15e4a0b8'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'run_score'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_number'
                        id: '4be840b70f374edabe5ddc922886eeb9'
                        key: {
                            category: 'x_doom_run'
                            prefix: 'DOOM'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '4d602b7a3cdc46cdba1a3fbdf1ff1001'
                        key: {
                            list_id: {
                                id: '42e781c9bf494b8ca79e8661caed152f'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'achievement'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '4e67d2c1498d45c9b5b5bd184bc058b5'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '4edcf91ff6014c0688c75ecdb0b38ad5'
                        key: {
                            name: 'x_doom/engine-wasm'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4f3e62bfa36c4cf7bc5fcab4b2f8380a'
                        key: {
                            name: 'x_doom_run'
                            element: 'integrity'
                            value: 'verified'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4fbdc8d8560e4ebf89634c4f3661c200'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'earned_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5031a557913b4d38842d209311808786'
                        key: {
                            name: 'x_doom_player'
                            element: 'rank_title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '508dbcccd7904433aed119ac416d5ec0'
                        key: {
                            name: 'x_doom_run'
                            element: 'secrets'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5117119a09ee4cf091e980f5ad9a9243'
                        key: {
                            name: 'x_doom_player'
                            element: 'playtime_seconds'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '52ac4488e0e4487a94f284e0554e784b'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'integrity'
                            position: '18'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '536ed8383106423ba2bfa2bb51a34c87'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'run'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '539b37b80d5f487b9335211a3bdbc5e5'
                        key: {
                            name: 'x_doom_player'
                            element: 'levels_cleared'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '547e514135ce4e9d891ad4bd128e3db8'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'levels_cleared'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '55870ea02f8b4f90a24959b2a6c512bd'
                        key: {
                            application_file: '29dbec50d3aa4a71960fac8c2b3d3595'
                            source_artifact: '3249a146819640799dc67c997e3001f3'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '55ac64366353417eb3e8939071395fcb'
                        key: {
                            list_id: {
                                id: '42e781c9bf494b8ca79e8661caed152f'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'player'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: '56ea8f6bd2034a8fa9c46d6df3658b0d'
                        key: {
                            logical_table_name: 'x_doom_player_achievement'
                            col_name_string: 'player,achievement'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '58ba8413bf9c445da94a6a0a32caa08f'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5bdc8b959f934e41bc126abb7aa934cd'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'playtime_seconds'
                            position: '18'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: '5c1352b686ba4b81b0e36c28e726ed93'
                        key: {
                            endpoint: 'x_doom_doomguy.do'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5dbccf78656b4065a3e2fc1d128569b2'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'earned_at'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '5e0087ffdab748bdb4d1c189893bf1e3'
                        key: {
                            name: 'x_doom/engine-wasm.js.map'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '5f453de6f7c344b887fcd94d01e9a29f'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '6488a25000124511becd300e530a968a'
                        key: {
                            list_id: {
                                id: 'a3649b96dfe64925a37639b7f3484042'
                                key: {
                                    name: 'x_doom_player'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'callsign'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '64e129516afc412ea88786fe2ffa080d'
                        key: {
                            name: 'x_doom_player'
                            element: 'perfect_levels'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6503bd1c3068456ab9b710923c4331d5'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'achievement'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '653f591718d04b109cf2c0a6e246acd4'
                        key: {
                            list_id: {
                                id: '6e4b6fac146e41a4afa2cc38adc593fc'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'score'
                        }
                    },
                    {
                        table: 'sys_index'
                        id: '6568a41b57604538a8d80a0fc13332b3'
                        key: {
                            logical_table_name: 'x_doom_player'
                            col_name_string: 'user'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '666835cd10f646fba2791fd171f35fc3'
                        key: {
                            name: 'x_doom_player'
                            element: 'doomguy_shots'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '67521578a29c438abf0397142a93d9fa'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'map'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6940f26175d1497e8a2d0eaf1678e560'
                        key: {
                            sys_security_acl: '92caef1961c545c78f5113acec7a1f3c'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '699608939c754c8395363446dc3e4c4f'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'items'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '69e24797236b4cb9a1ef22f3eb4722e6'
                        key: {
                            name: 'x_doom_player'
                            element: 'total_score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6b8b2db494e24c698e3e020cfb7c91d1'
                        key: {
                            sys_security_acl: 'a7f818c22398496c8e82ca765ef3ff34'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6be616b6e8294b2a9c33ca550d006adf'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '6c1cf358468b4afe8fdba9a6668e3b31'
                        key: {
                            name: 'x_doom_run'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6cc2d3ed2f854de7a9215a2d3ac0129b'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'par_seconds'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6cc74c1d7e514f1196b999b61118259c'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'doomguy_steps'
                            position: '21'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '6db548d12dd14fa0b6122e915ef3b5b2'
                        key: {
                            list_id: {
                                id: '42e781c9bf494b8ca79e8661caed152f'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'earned_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6dbeef8d86d64f03864de9e71e89d68e'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'items_max'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: '6e4b6fac146e41a4afa2cc38adc593fc'
                        key: {
                            name: 'x_doom_run'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '6edb2681de774c1980b94069f504ef22'
                        key: {
                            sys_ui_section: {
                                id: '99cf9ee004be4564a5554887a4433907'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    caption: 'Earned'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'achievement'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6f5959cf4e8a4f1385cf326891a3da29'
                        key: {
                            name: 'x_doom_run'
                            element: 'player'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: '6f6df11da4d844f694d8139d9d335fdb'
                        key: {
                            name: 'x_doom_achievement'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6fa1b5f7a40c4341a10a3e1f99bb8f02'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'score'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6fc1ff24d2b14b96a4f85bf26324b7ad'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '70d8fa656dbb499082abeecbde73fc3c'
                        key: {
                            name: 'x_doom/game-wad'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '726cb3dec5ee49e089908dc4a1889ec5'
                        key: {
                            name: 'x_doom_player'
                            element: 'doomguy_steps'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '729a17e203ce4b01845507aff4d1b889'
                        key: {
                            name: 'x_doom_run'
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '73203ea98fd24c0a8cb797c16e31d411'
                        key: {
                            list_id: {
                                id: '6e4b6fac146e41a4afa2cc38adc593fc'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'started_at'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '73d33ad9058c424594def0a4e82156cf'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '15'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '752dbf8e0f5f408eb3670312ec0e6dd3'
                        key: {
                            name: 'x_doom_player'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '75be97fc71e5400bbf1333e2df13bca5'
                        key: {
                            list_id: {
                                id: '6e4b6fac146e41a4afa2cc38adc593fc'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'integrity'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '769fecfb1a5a4917b3643303688ec2a0'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'total_secrets'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '7720ac2ed84740f1a7cb9c4b04fa7a39'
                        key: {
                            name: 'x_doom_player_achievement'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7771906d1a8c439b955621137644284b'
                        key: {
                            sys_security_acl: '751f6dceabf64b0893f904d68e3cf029'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '77c26a774c4041489c5fbfef06856a5e'
                        key: {
                            name: 'x_doom/doom.js.map'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '78edda67a2f544c79f0656b9242df94a'
                        key: {
                            sys_security_acl: 'e3e1dcf918564c25a37b4e57f9f4bc27'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7aebfef15d454e4ebdcd0a07b9cf4f4d'
                        key: {
                            name: 'x_doom_run'
                            element: 'secrets'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7b51655b4dde47beb4bf6ce8eaf1a2b9'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'total_secrets'
                            position: '14'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '7b9c9214d5c244158090d9c6834af4c5'
                        key: {
                            list_id: {
                                id: '6f6df11da4d844f694d8139d9d335fdb'
                                key: {
                                    name: 'x_doom_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'metric'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7c1b3276d9c7403f97df60352f8cc8f7'
                        key: {
                            name: 'x_doom_player'
                            element: 'levels_cleared'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7e516a12450740baa9814d32ca3577cd'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'achievement'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7e6a6dc7fa64481c9085b342849f9bd5'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '7f143a5bea73442fa7f9888a52228e6d'
                        key: {
                            name: 'x_doom/engine-glue.js.map'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '7fde675340c04476983d8b9842ea986a'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'items_max'
                            position: '10'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '80cecf9964c3465a94cda02d3a852ba1'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'sort_order'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: '835c9c11ed0e48f6b87928cd6c3cd837'
                        key: {
                            name: 'x_doom_level_stat'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '83d77dafe39642d0bbe88ed7c5cde9f9'
                        key: {
                            name: 'x_doom_player'
                            element: 'perfect_levels'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '84061bdfb0fe45b98ec5e7591851691c'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kills'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '849d6e5a1843437aae21e938799f704a'
                        key: {
                            name: 'x_doom_run'
                            element: 'skill'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '85bafa613ae547fdb9c540c5f92c05e1'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'par_beaten'
                            position: '17'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '85caea33bc34471096b852d33d561193'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'number'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '86127ed9e3f74b49bb2141d8f54ff3b1'
                        key: {
                            name: 'x_doom_run'
                            element: 'state'
                            value: 'completed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '867d4ddade7d4cc48041b860ec5f73c5'
                        key: {
                            application_file: '48eab23eb2ab4d50be701e881ca815c0'
                            source_artifact: '3a8a614bdb4548d2acea748242c0d405'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '86a8deeac4eb47ac9b6e002dc96dc57f'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'map'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '871eff199fee4dd48cf59b982e13d233'
                        key: {
                            name: 'x_doom_run'
                            element: 'episode'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '886c5e0ae2fe4c8e91aef7deff8aba3f'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'sort_order'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8966a3dea5434df0bb32ff0680bc5031'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'kills'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '89e55fec94be400ea80452567fe09636'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'kills'
                            position: '7'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8a26e4131dd4406d9727044bc149c837'
                        key: {
                            name: 'x_doom_run'
                            element: 'skill'
                            value: '1'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '8c5bf87cd8fc425cb3257ed2cc63fdf7'
                        key: {
                            list_id: {
                                id: 'a3649b96dfe64925a37639b7f3484042'
                                key: {
                                    name: 'x_doom_player'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'best_score'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8cacefe2dbd74ab5ac2571f2d1e51bc3'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'secrets'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '8d0dd50aba2c48cebe15ad5a8375d66b'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'metric'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '8d863fdf87ce42c6896efe760360ceb9'
                        key: {
                            list_id: {
                                id: '835c9c11ed0e48f6b87928cd6c3cd837'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'run'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '8db49a441a3a417897cd6b84dce375cd'
                        key: {
                            name: 'x_doom_achievement'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8def3b5dc0074712b1074970d9e0aa16'
                        key: {
                            name: 'x_doom_player'
                            element: 'total_items'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '8e99a8d1ed5640c397831cc95bd1dd34'
                        key: {
                            list_id: {
                                id: '6e4b6fac146e41a4afa2cc38adc593fc'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'kills'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8f0da4d533944d698cea6f55357c64a0'
                        key: {
                            name: 'x_doom_run'
                            element: 'kills'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '8f5c5bc15b6d4b72801f61ae5b3d526a'
                        key: {
                            sys_security_acl: 'ab9754d430ff4f119242ed38084224df'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '8fbbe5dc9e8a45bb96fdcc1f615cbdac'
                        key: {
                            list_id: {
                                id: '6e4b6fac146e41a4afa2cc38adc593fc'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'state'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9084fd57ffd54491961bbd057d78cc96'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '15'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '92beae0d2c3c4fbf8f59e7e0a22cbe5c'
                        key: {
                            name: 'x_doom_run'
                            element: 'skill'
                            value: '3'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '938ad504a58e4e058bc7041843f5904b'
                        key: {
                            name: 'x_doom_run'
                            element: 'number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9446f5d3b7b6476cb4b319703563b90b'
                        key: {
                            name: 'x_doom_run'
                            element: 'state'
                            value: 'abandoned'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '947e695a2e324788a2bf028e58716252'
                        key: {
                            name: 'x_doom_player'
                            element: 'doomguy_shots'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '96712e130f8840e9a6ee4c5ae63a8ec6'
                        key: {
                            sys_ui_form: {
                                id: '6c1cf358468b4afe8fdba9a6668e3b31'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: '970046ee30d0403898bf0d391402ef78'
                        key: {
                            list_id: {
                                id: '835c9c11ed0e48f6b87928cd6c3cd837'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'kills'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '977a7c1a47da4c98aba94ea7bb7f8767'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'time_seconds'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: '9921e6f40acc453c96aaa92375f5725d'
                        key: {
                            name: 'x_doom_achievement'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '99c3e999756442bdb0094a2691a4a6b8'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'skill'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: '99cf9ee004be4564a5554887a4433907'
                        key: {
                            name: 'x_doom_player_achievement'
                            caption: 'Earned'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9a93a1d7af454030973a10d34f973fea'
                        key: {
                            name: 'x_doom_run'
                            element: 'started_at'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9af0ba3ec3ac4ce4a7ebde90b86ffe58'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'par_beaten'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: '9b32b447329b4ba28ac92798ed065e1b'
                        key: {
                            sys_ui_form: {
                                id: 'ecb8276a7c89414b83d3eacc47326110'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '99cf9ee004be4564a5554887a4433907'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    caption: 'Earned'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: '9eef9cdfa5544e6f9b870cc076813c66'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'run'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a002495e591f499995e5efef33a63b3a'
                        key: {
                            name: 'x_doom_player'
                            element: 'callsign'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a00b93a4c62e4db5ab446734045ba63b'
                        key: {
                            name: 'x_doom_player'
                            element: 'playtime_seconds'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a1311f0604de4ba3a8d94c8c383cb6f6'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'doomguy_steps'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list'
                        id: 'a3649b96dfe64925a37639b7f3484042'
                        key: {
                            name: 'x_doom_player'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                            element: 'NULL'
                            relationship: 'NULL'
                            parent: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a44fb992085c44b4bdfadd0897c83c3a'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'threshold'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'a5035dc484774d0197a9f28192978a52'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'best_score'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'a5668f19cc534669a92fdde27fedfef4'
                        key: {
                            name: 'x_doom/game-wad.js.map'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a75b1001fed549d28ec7af2f34637101'
                        key: {
                            name: 'x_doom_player'
                            element: 'total_kills'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'a7da8e9d8821483aae2c275f56b2db78'
                        key: {
                            name: 'x_doom_run'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a88fc23c536a47f986110ab0e6171c70'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a95d06814f334cbfab2f65e408d8692e'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a983eae9deee49c78ccdd443a9ee207b'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'total_kills'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'aa1f8f6e10fd4c288a2e8048ab92ae3e'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '19'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'ab4a222450bc411caa940f17a48efcf9'
                        key: {
                            list_id: {
                                id: '6e4b6fac146e41a4afa2cc38adc593fc'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'player'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ab7f0bf2c24449acb113d7cd68611e69'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'code'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'abe0a9ba8df64ec9b0c84ec98fd2a61c'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'secrets_max'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ac639ca52e6d4e49948a4c7ffe99e0f1'
                        key: {
                            name: 'x_doom_run'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ac70d8a769684a6eb7e7cf6d20bab9d2'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '6'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'ad00a925753844dab37036b5b8071bc0'
                        key: {
                            name: 'x_doom_level_stat'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'aeb5d377a6f240dcb0692011bad238e3'
                        key: {
                            name: 'x_doom_run'
                            element: 'integrity'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'aeb5d58163bf49e5bbba9ea96be04256'
                        key: {
                            sys_ui_section: {
                                id: '99cf9ee004be4564a5554887a4433907'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    caption: 'Earned'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'player'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b09e56bece064488a19f339409ad2c65'
                        key: {
                            sys_ui_section: {
                                id: '99cf9ee004be4564a5554887a4433907'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    caption: 'Earned'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b0b13daca4a9416bbc4ba56f32c20cb4'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b10288a40b5f4c78b9c74f6fc2e8f9c7'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'player'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'b1969c3baefa47859fd40eab280e1a34'
                        key: {
                            sys_ui_form: {
                                id: '0d6f07de4f7748bc9ef562116f176717'
                                key: {
                                    name: 'x_doom_player'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'b217b497e79b4c2a97a57c20337cb6cc'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'items'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b23e0e77bba34952b5cb4297d0ae80f4'
                        key: {
                            name: 'x_doom_player'
                            element: 'user'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'b48094bd7d994e89a3e3dfe3bbce263c'
                        key: {
                            list_id: {
                                id: '42e781c9bf494b8ca79e8661caed152f'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'run'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b55e056f6a7e4498a9a6d16a0749df25'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'run'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b70dd72af4d345459cf58c9fe71d94e0'
                        key: {
                            name: 'x_doom_run'
                            element: 'items'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b7fc921d9f2d42008798752288953891'
                        key: {
                            name: 'x_doom_run'
                            element: 'number'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b8263a09ec8e449f82cfdfe163b110d5'
                        key: {
                            name: 'x_doom_player'
                            element: 'total_score'
                        }
                    },
                    {
                        table: 'sys_ui_form_section'
                        id: 'b877f12f40474d559afb2491b256a2e7'
                        key: {
                            sys_ui_form: {
                                id: 'ad00a925753844dab37036b5b8071bc0'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b8effa6949d54fbea8b9e00a8892f158'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'bae2dc4cf7314515a16f44b517eee52e'
                        key: {
                            list_id: {
                                id: 'a3649b96dfe64925a37639b7f3484042'
                                key: {
                                    name: 'x_doom_player'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'rank_title'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bae6f6d0f534437d8a76add0bd1f85c5'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'active'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bb6e0efb6f3b40499b072a275d9acb74'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'code'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'bbae9a9c196b4be1bdc045efe0c0cd4b'
                        key: {
                            list_id: {
                                id: '835c9c11ed0e48f6b87928cd6c3cd837'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'par_seconds'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'bd33833552a34b968276f0f8be59832c'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'ended_at'
                            position: '8'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c01bcbc1f97249d9b16e2e1249d82a75'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'par_seconds'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c1cafea216ad4237b8e8e812afc50514'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'doomguy_shots'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c27b1c08b0244f7cb66852d4ef5dcd9d'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'map'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c2eaf36ae8464e2b97f77785bd0b5f28'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.end_split'
                            position: '13'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c3267398f47f437d91a9af2ea3532eca'
                        key: {
                            sys_security_acl: '45f839e117af48f7a4e1ee552117de7d'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'c3589425f0054f7a8608d48551bc00c9'
                        key: {
                            list_id: {
                                id: '6e4b6fac146e41a4afa2cc38adc593fc'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'skill'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'c5b34452bafa45d4881b714e0eedc9b1'
                        key: {
                            list_id: {
                                id: '835c9c11ed0e48f6b87928cd6c3cd837'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'score'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'c6eaa9e7d417496fa11a9f07b23f2212'
                        key: {
                            name: 'x_doom_player'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c713588b7adf484fa594d6b951454bdd'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'threshold'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'c7d14502c7884a9da223a4138538efd9'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'levels_cleared'
                            position: '9'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'c9971a1d74ec4ad3a9e9c81f495fa3af'
                        key: {
                            name: 'x_doom_achievement'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cc0260733fcc4bdf84504058440b7a79'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'cd41b906c5db45babae218ebef045993'
                        key: {
                            sys_ui_section: {
                                id: '99cf9ee004be4564a5554887a4433907'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    caption: 'Earned'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'earned_at'
                            position: '5'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'cfb6d994ca1342a8998800d99e114c74'
                        key: {
                            list_id: {
                                id: '835c9c11ed0e48f6b87928cd6c3cd837'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'secrets'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd0226dbde7e0456c8935ac33deb098d3'
                        key: {
                            name: 'x_doom_run'
                            element: 'episode'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd22d63fa43d64aa2a77e05b39e3d94ef'
                        key: {
                            sys_security_acl: 'fa56a93164454695b1aa38e291fa568e'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd297e8e98918405aa3e9a3ac9f7b1f63'
                        key: {
                            name: 'x_doom_run'
                            element: 'skill'
                            value: '5'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd2cd864320fe4c1c8e8c7fd0995502ce'
                        key: {
                            name: 'x_doom_run'
                            element: 'state'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd3f67a5091454160a4e753542d960b4e'
                        key: {
                            name: 'x_doom_run'
                            element: 'state'
                            value: 'playing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'd428eb4db20c442db8284dee45028c68'
                        key: {
                            name: 'x_doom.admin'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'd517353438964816b092d0b5ea0683ba'
                        key: {
                            name: 'x_doom_run'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd584b8289f8543f5b7143931450e7461'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'runs_completed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'd5d2751372f84f2d874453639a0e6237'
                        key: {
                            list_id: {
                                id: '6f6df11da4d844f694d8139d9d335fdb'
                                key: {
                                    name: 'x_doom_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'sort_order'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd6bd062d862749639218413a5692492c'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            value: 'perfect_levels'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'd7d5f17a63b640ba86f412270d697646'
                        key: {
                            name: 'x_doom/game-cfg'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'd7fb3617fa444b169e00b3978de7ae6f'
                        key: {
                            endpoint: 'x_doom_play.do'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd8ad56c8e90b45ce8eff7fe2208fc17b'
                        key: {
                            name: 'x_doom_player'
                            element: 'runs_completed'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd8e74c552bee4611bbe7b8ed1236006f'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'run'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'd9277505fe944a2a8a8a62387c90b0f4'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'secrets'
                            position: '11'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'dabcd83edf504ee4816d99f1373a59b4'
                        key: {
                            list_id: {
                                id: '835c9c11ed0e48f6b87928cd6c3cd837'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'items'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'db0d135272554e6387c98826963b58ed'
                        key: {
                            application_file: '77c26a774c4041489c5fbfef06856a5e'
                            source_artifact: '3a8a614bdb4548d2acea748242c0d405'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'dbaf0f0bd17d468e92eacf98f188652d'
                        key: {
                            name: 'x_doom/engine-glue'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dcdd489589d14b6d9037bbdbf6822cd3'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'items_max'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'dd01bb2831e245c28fdbcd060784f96b'
                        key: {
                            list_id: {
                                id: '6f6df11da4d844f694d8139d9d335fdb'
                                key: {
                                    name: 'x_doom_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'name'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'dd62071db21941c1880179b51bf5f291'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'doomguy_shots'
                            position: '23'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dd64d097f9744c61b383f3a065a6a634'
                        key: {
                            name: 'x_doom_player'
                            element: 'last_played'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'ddd84e7c4fc44032a7c678215fa895ae'
                        key: {
                            application_file: 'f0cfff4be7054fa9ae157e81fd52d862'
                            source_artifact: '3249a146819640799dc67c997e3001f3'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'deba0520cde14819830e768088778fcd'
                        key: {
                            name: 'x_doom_player'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'df115a28603a4b03a176f180bddb8c69'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'rank_title'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'df153ccbec4548d2ad16c5ab044a8674'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'last_played'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'e2333bc0f43243dcb13bf35f00b8aa04'
                        key: {
                            name: 'x_doom_run'
                            element: 'skill'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e3878dc03e58456da986af9d1157a206'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'metric'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e406ecd89036438daa997f90bbd88f4a'
                        key: {
                            name: 'x_doom_player_achievement'
                            element: 'player'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e41aee6720d54042ac3cd5b9a5a50c94'
                        key: {
                            name: 'x_doom_achievement'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e5344a0fa6f34072b92ca0075ad1dbe9'
                        key: {
                            name: 'x_doom_run'
                            element: 'score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'e557367a653d48ea9220a74380a94dc8'
                        key: {
                            list_id: {
                                id: '6e4b6fac146e41a4afa2cc38adc593fc'
                                key: {
                                    name: 'x_doom_run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'number'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e5875b9898ae43d8bc32efa353a2b6b6'
                        key: {
                            sys_ui_section: {
                                id: '99cf9ee004be4564a5554887a4433907'
                                key: {
                                    name: 'x_doom_player_achievement'
                                    caption: 'Earned'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'run'
                            position: '4'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e658750fbe884be5a2e13c5dde12053d'
                        key: {
                            name: 'x_doom_run'
                            element: 'integrity_notes'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'e67671615db44a83be0d38ab7a06e49b'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'name'
                            position: '2'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e8c16a8d7ce044c1a013f02f10b34b08'
                        key: {
                            name: 'x_doom_player'
                            element: 'callsign'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ea0c2d584b894576992f5a113b302928'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'time_seconds'
                            position: '3'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ebd46afd5cc04a4abc8c03327fc99756'
                        key: {
                            sys_ui_section: {
                                id: 'f12b2eeffde34528b26c2caf273c3b72'
                                key: {
                                    name: 'x_doom_level_stat'
                                    caption: 'Level'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '0'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ebf518a7bf7b430eb5076cb968780d97'
                        key: {
                            name: 'x_doom_run'
                            element: 'kills'
                        }
                    },
                    {
                        table: 'sys_ui_form'
                        id: 'ecb8276a7c89414b83d3eacc47326110'
                        key: {
                            name: 'x_doom_player_achievement'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ede46991bdbe409e8465bc94137f8558'
                        key: {
                            sys_ui_section: {
                                id: '12513c32c33b411dae4234e12d0c04ed'
                                key: {
                                    name: 'x_doom_run'
                                    caption: 'Run'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'score'
                            position: '17'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'efe0a6270371468f9f0c70f337900332'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'par_seconds'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'f082b45b9302451591b1160ab9c9c391'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.begin_split'
                            position: '20'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'f0cfff4be7054fa9ae157e81fd52d862'
                        key: {
                            name: 'x_doom/doomguy'
                        }
                    },
                    {
                        table: 'sys_ui_section'
                        id: 'f12b2eeffde34528b26c2caf273c3b72'
                        key: {
                            name: 'x_doom_level_stat'
                            caption: 'Level'
                            view: {
                                id: 'Default view'
                                key: {
                                    name: 'NULL'
                                }
                            }
                            sys_domain: 'global'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'f3aebe896853460ca341c646d0c7e03a'
                        key: {
                            list_id: {
                                id: '835c9c11ed0e48f6b87928cd6c3cd837'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'kills_max'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'f3b86ae3bf494f89b93abd431b400a38'
                        key: {
                            list_id: {
                                id: '6f6df11da4d844f694d8139d9d335fdb'
                                key: {
                                    name: 'x_doom_achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'active'
                        }
                    },
                    {
                        table: 'sys_ws_query_parameter_map'
                        id: 'f5fbd94a4b0944338c6f71e7a2d66c23'
                        key: {
                            web_service_operation: 'b4c5e26c77484334a89bef25def374a4'
                            web_service_query_parameter: 'db293a08860c4151bbb4a0de0240cf41'
                        }
                    },
                    {
                        table: 'sys_ui_list_element'
                        id: 'f638cff3944642f9ab567484d3f5d605'
                        key: {
                            list_id: {
                                id: '835c9c11ed0e48f6b87928cd6c3cd837'
                                key: {
                                    name: 'x_doom_level_stat'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                    element: 'NULL'
                                    relationship: 'NULL'
                                    parent: 'NULL'
                                }
                            }
                            element: 'time_seconds'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f9cb5b9402fb495fa27fae8f1145dc83'
                        key: {
                            sys_security_acl: '3018d231696047488e4439ef1ab67c50'
                            sys_user_role: {
                                id: 'd428eb4db20c442db8284dee45028c68'
                                key: {
                                    name: 'x_doom.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fab860d83846415fb12cf730205fd577'
                        key: {
                            name: 'x_doom_player'
                            element: 'doomguy_steps'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fb1d18e2a4a241579ceb122ece97a5b5'
                        key: {
                            name: 'x_doom_run'
                            element: 'started_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'fb3a5a68e82349fc895d9764af0c0dde'
                        key: {
                            sys_ui_section: {
                                id: '0a24cd8f3105490d8468d377a7e29d7e'
                                key: {
                                    name: 'x_doom_player'
                                    caption: 'Marine'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: 'user'
                            position: '1'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fddab97557454353b636df3db047f27e'
                        key: {
                            name: 'x_doom_level_stat'
                            element: 'kills_max'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fe79300103f94847b0f4f2ccfa862228'
                        key: {
                            name: 'x_doom_player'
                            element: 'total_secrets'
                        }
                    },
                    {
                        table: 'sys_ui_element'
                        id: 'ffddcfe6bb034beb9e3d28696c25513c'
                        key: {
                            sys_ui_section: {
                                id: '385c12f6c0e64771bce01c8f487dd8ed'
                                key: {
                                    name: 'x_doom_achievement'
                                    caption: 'Achievement'
                                    view: {
                                        id: 'Default view'
                                        key: {
                                            name: 'NULL'
                                        }
                                    }
                                    sys_domain: 'global'
                                }
                            }
                            element: '.split'
                            position: '4'
                        }
                    },
                ]
            }
        }
    }
}
