// components/logs/FilterPresets.tsx
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Save, Star, Trash } from "lucide-react";

interface FilterPreset {
    id: string;
    name: string;
    description?: string;
    filters: Record<string, any>;
    isDefault?: boolean;
}

interface FilterPresetsProps {
    onSelect: (preset: FilterPreset) => void;
    selected: string | null;
    onSaveCurrentFilter: () => Record<string, any>;
}

const defaultPresets: FilterPreset[] = [
    {
        id: 'errors',
        name: 'Error Logs',
        description: 'Show all error level logs',
        filters: { level: ['error'] },
        isDefault: true,
    },
    {
        id: 'security',
        name: 'Security Events',
        description: 'Authentication and authorization events',
        filters: { action: ['login', 'logout', 'permission_change'] },
        isDefault: true,
    },
];

export function FilterPresets({ onSelect, selected, onSaveCurrentFilter }: FilterPresetsProps) {
    const [presets, setPresets] = useState<FilterPreset[]>([...defaultPresets]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');
    const [newPresetDescription, setNewPresetDescription] = useState('');

    const handleSavePreset = () => {
        const currentFilters = onSaveCurrentFilter();
        const newPreset: FilterPreset = {
            id: Date.now().toString(),
            name: newPresetName,
            description: newPresetDescription,
            filters: currentFilters,
        };

        setPresets([...presets, newPreset]);
        setIsDialogOpen(false);
        setNewPresetName('');
        setNewPresetDescription('');
    };

    const handleDeletePreset = (presetId: string) => {
        setPresets(presets.filter(preset => preset.id !== presetId));
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Select
                        value={selected || ''}
                        onValueChange={(value) => {
                            const preset = presets.find(p => p.id === value);
                            if (preset) onSelect(preset);
                        }}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select filter preset" />
                        </SelectTrigger>
                        <SelectContent>
                            <div className="p-2">
                                <h4 className="mb-2 text-sm font-medium text-muted-foreground">Default Presets</h4>
                                {presets
                                    .filter(preset => preset.isDefault)
                                    .map(preset => (
                                        <SelectItem key={preset.id} value={preset.id}>
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <div>
                                                    <div>{preset.name}</div>
                                                    {preset.description && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {preset.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}

                                {presets.some(preset => !preset.isDefault) && (
                                    <>
                                        <h4 className="mb-2 mt-4 text-sm font-medium text-muted-foreground">
                                            Custom Presets
                                        </h4>
                                        {presets
                                            .filter(preset => !preset.isDefault)
                                            .map(preset => (
                                                <SelectItem key={preset.id} value={preset.id}>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div>{preset.name}</div>
                                                            {preset.description && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    {preset.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {!preset.isDefault && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeletePreset(preset.id);
                                                                }}
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                    </>
                                )}
                            </div>
                        </SelectContent>
                    </Select>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Save className="mr-2 h-4 w-4" />
                                Save Current Filter
                            </Button>
                        </DialogTrigger>
                        <DialogContent aria-describedby={``}>
                            <DialogHeader>
                                <DialogTitle>Save Filter Preset</DialogTitle>
                                <DialogDescription>
                                    Create a new preset from your current filter configuration
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Preset Name</label>
                                    <Input
                                        placeholder="Enter preset name"
                                        value={newPresetName}
                                        onChange={(e) => setNewPresetName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Description (optional)</label>
                                    <Input
                                        placeholder="Enter description"
                                        value={newPresetDescription}
                                        onChange={(e) => setNewPresetDescription(e.target.value)}
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSavePreset} disabled={!newPresetName}>
                                    Save Preset
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {selected && (
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                            Active Preset: {presets.find(p => p.id === selected)?.name}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSelect({ id: '', name: '', filters: {} })}
                        >
                            Clear
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}