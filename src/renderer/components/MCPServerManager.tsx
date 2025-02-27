import React, { useState } from 'react'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Switch,
    Typography,
} from '@mui/material'
import { Delete, Edit } from 'lucide-react'
import { useAtom } from 'jotai'
import { v4 as uuidv4 } from 'uuid'
import { settingsAtom } from '../stores/atoms'
import { MCPServerConfig } from '../../shared/types'
import { useTranslation } from 'react-i18next'

interface Props {
}

export default function MCPServerManager(props: Props) {
    const { t } = useTranslation()
    const [settings, setSettings] = useAtom(settingsAtom)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [editConfig, setEditConfig] = useState<MCPServerConfig | null>(null)

    const handleAdd = () => {
        setEditConfig({
            id: uuidv4(),
            name: '',
            description: '',
            commandLine: '',
            enabled: true,
            status: 'connecting', // 初始状态
        })
        setOpenAddDialog(true)
    }

    const handleEdit = (config: MCPServerConfig) => {
        setEditConfig({ ...config }) // 复制一份，避免直接修改原数据
        setOpenAddDialog(true)
    }

    const handleDelete = (id: string) => {
        setSettings({
            ...settings,
            mcpServers: settings.mcpServers.filter((c) => c.id !== id),
        })
    }

    const handleSave = (config: MCPServerConfig) => {
        if (settings.mcpServers.find((c) => c.id === config.id)) {
            // 更新
            setSettings({
                ...settings,
                mcpServers: settings.mcpServers.map((c) =>
                    c.id === config.id ? config : c
                ),
            })
        } else {
            // 新增
            setSettings({ ...settings, mcpServers: [...settings.mcpServers, config] })
        }
        setOpenAddDialog(false)
        setEditConfig(null)
    }

    const handleCloseDialog = () => {
        setOpenAddDialog(false)
        setEditConfig(null)
    }

    return (
        <Box>
            <Typography variant="h6">MCP Servers</Typography>
            <List>
                {settings.mcpServers.map((config) => (
                    <ListItem key={config.id} secondaryAction={
                        <Box>
                            <IconButton onClick={() => handleEdit(config)}><Edit /></IconButton>
                            <IconButton onClick={() => handleDelete(config.id)}><Delete /></IconButton>
                        </Box>
                    }>
                        <ListItemText
                            primary={config.name}
                            secondary={
                                <>
                                    {config.description}
                                    <br />
                                    Status: {config.status}
                                </>
                            }
                        />
                        <Switch
                            checked={config.enabled}
                            onChange={(e) =>
                                handleSave({ ...config, enabled: e.target.checked })
                            }
                        />
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" onClick={handleAdd}>
                Add MCP Server
            </Button>

            {/* 添加/编辑 对话框 */}
            <Dialog open={openAddDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editConfig ? 'Edit' : 'Add'} MCP Server</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        margin="normal"
                        value={editConfig?.name}
                        onChange={(e) =>
                            setEditConfig(
                                editConfig ? { ...editConfig, name: e.target.value } : null
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        margin="normal"
                        value={editConfig?.description}
                        onChange={(e) =>
                            setEditConfig(
                                editConfig
                                    ? { ...editConfig, description: e.target.value }
                                    : null
                            )
                        }
                    />
                    <TextField
                        fullWidth
                        label="Command Line"
                        variant="outlined"
                        margin="normal"
                        value={editConfig?.commandLine}
                        onChange={(e) =>
                            setEditConfig(
                                editConfig
                                    ? { ...editConfig, commandLine: e.target.value }
                                    : null
                            )
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>{t('cancel')}</Button>
                    <Button
                        onClick={() => {
                            if (editConfig) {
                                handleSave(editConfig)
                            }
                        }}
                        variant="contained"
                    >
                        {t('save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}