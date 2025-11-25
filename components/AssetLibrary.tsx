
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
import { useData } from '../context/DataContext';
import { generateImageTags } from '../services/geminiService';
import { 
    UploadCloud, Folder, Image as ImageIcon, Video, MoreVertical, 
    Search, Filter, Trash2, Tag, Download, Grid, List, Eye, Calendar
} from 'lucide-react';
import { Asset } from '../types';

export const AssetLibrary: React.FC = () => {
    const { assets, addAsset, deleteAsset } = useData();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeTab, setActiveTab] = useState<'All' | 'Images' | 'Videos'>('All');
    const [isUploading, setIsUploading] = useState(false);
    const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

    const handleUpload = () => {
        setIsUploading(true);
        // Simulate upload
        setTimeout(async () => {
            const newAsset: Asset = {
                id: 'ast_' + Date.now(),
                name: 'New Uploaded Creative',
                type: 'image',
                url: '',
                size: '1.2 MB',
                dimensions: '1080x1080',
                tags: await generateImageTags('New Uploaded Creative'),
                createdAt: new Date().toISOString().split('T')[0]
            };
            addAsset(newAsset);
            setIsUploading(false);
        }, 1500);
    };

    const handleDelete = (id: string) => {
        deleteAsset(id);
        if (previewAsset?.id === id) setPreviewAsset(null);
    };

    const filteredAssets = assets.filter(a => 
        activeTab === 'All' ? true : 
        activeTab === 'Images' ? a.type === 'image' : 
        a.type === 'video'
    );

    return (
        <div className="space-y-6">
            {/* Preview Modal */}
            <Modal
                isOpen={!!previewAsset}
                onClose={() => setPreviewAsset(null)}
                title={previewAsset?.name || 'Asset Preview'}
                maxWidth="3xl"
                footer={
                    <>
                        <Button variant="danger" onClick={() => previewAsset && handleDelete(previewAsset.id)}>Delete</Button>
                        <Button variant="secondary">Download</Button>
                        <Button onClick={() => setPreviewAsset(null)}>Close</Button>
                    </>
                }
            >
                {previewAsset && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-900 rounded-xl flex items-center justify-center p-4 min-h-[300px] border border-border">
                            {previewAsset.type === 'image' ? (
                                <ImageIcon size={64} className="text-zinc-600" />
                            ) : (
                                <Video size={64} className="text-zinc-600" />
                            )}
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-textMain uppercase mb-2">Details</h4>
                                <div className="space-y-2 text-sm text-textMuted">
                                    <div className="flex justify-between border-b border-border pb-1">
                                        <span>Type</span>
                                        <span className="text-textMain capitalize">{previewAsset.type}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-border pb-1">
                                        <span>Dimensions</span>
                                        <span className="text-textMain">{previewAsset.dimensions}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-border pb-1">
                                        <span>Size</span>
                                        <span className="text-textMain">{previewAsset.size}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-border pb-1">
                                        <span>Uploaded</span>
                                        <span className="text-textMain">{previewAsset.createdAt}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-bold text-textMain uppercase mb-2">AI Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {previewAsset.tags.map(tag => (
                                        <Badge key={tag} variant="neutral">{tag}</Badge>
                                    ))}
                                    <button className="text-xs text-primary hover:underline flex items-center gap-1">
                                        <Tag size={12} /> Add Tag
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-textMain tracking-tight">Asset Library</h1>
                    <p className="text-textMuted mt-1">Manage, organize, and analyze your creative digital assets.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-surface border border-border rounded-lg flex p-1">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-zinc-700 text-white' : 'text-textMuted hover:text-textMain'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-zinc-700 text-white' : 'text-textMuted hover:text-textMain'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                    <Button onClick={handleUpload} isLoading={isUploading}>
                        <UploadCloud size={16} className="mr-2" /> Upload Asset
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
                {/* Sidebar */}
                <Card className="col-span-1 h-full flex flex-col p-4 space-y-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-3 text-textMuted" />
                        <input 
                            type="text" 
                            placeholder="Search assets..." 
                            className="w-full bg-background border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none focus:border-primary"
                        />
                    </div>
                    
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold text-textMuted uppercase mb-2 px-2">Folders</h4>
                        <button className="w-full flex items-center justify-between p-2 rounded hover:bg-zinc-800 text-sm text-textMain bg-primary/10 border border-primary/20">
                            <span className="flex items-center gap-2"><Folder size={16} className="text-primary" /> All Assets</span>
                            <span className="text-xs text-textMuted">{assets.length}</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-2 rounded hover:bg-zinc-800 text-sm text-textMain">
                            <span className="flex items-center gap-2"><ImageIcon size={16} className="text-pink-400" /> Images</span>
                            <span className="text-xs text-textMuted">{assets.filter(a=>a.type==='image').length}</span>
                        </button>
                        <button className="w-full flex items-center justify-between p-2 rounded hover:bg-zinc-800 text-sm text-textMain">
                            <span className="flex items-center gap-2"><Video size={16} className="text-blue-400" /> Videos</span>
                            <span className="text-xs text-textMuted">{assets.filter(a=>a.type==='video').length}</span>
                        </button>
                    </div>
                </Card>

                {/* Main Grid */}
                <div className="col-span-3 bg-surface border border-border rounded-xl p-6 overflow-y-auto custom-scrollbar">
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-border pb-4 mb-6">
                        {['All', 'Images', 'Videos'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`text-sm font-medium transition-colors relative pb-4 -mb-4 ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-textMuted hover:text-textMain'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredAssets.map(asset => (
                                <div 
                                    key={asset.id} 
                                    className="group relative bg-background border border-border rounded-lg overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer"
                                    onClick={() => setPreviewAsset(asset)}
                                >
                                    <div className="aspect-square bg-zinc-800 relative flex items-center justify-center overflow-hidden">
                                        {asset.type === 'image' ? (
                                            <ImageIcon size={48} className="text-zinc-700" />
                                        ) : (
                                            <Video size={48} className="text-zinc-700" />
                                        )}
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <Eye size={24} className="text-white mb-2" />
                                            <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                                <Button size="sm" variant="secondary"><Download size={14} /></Button>
                                                <Button size="sm" variant="danger" onClick={() => handleDelete(asset.id)}><Trash2 size={14} /></Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="text-sm font-medium truncate mb-1">{asset.name}</h4>
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {asset.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-textMuted">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-textMuted">
                                            <span>{asset.size}</span>
                                            <span>{asset.dimensions}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredAssets.map(asset => (
                                <div 
                                    key={asset.id} 
                                    className="flex items-center justify-between p-3 bg-background border border-border rounded-lg hover:border-primary/30 group cursor-pointer"
                                    onClick={() => setPreviewAsset(asset)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center">
                                            {asset.type === 'image' ? <ImageIcon size={20} /> : <Video size={20} />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-textMain">{asset.name}</h4>
                                            <p className="text-xs text-textMuted">{asset.dimensions} • {asset.size}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1">
                                            {asset.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-2 py-0.5 bg-zinc-800 rounded text-textMuted border border-zinc-700">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="text-xs text-textMuted">{asset.createdAt}</div>
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }} className="p-2 text-textMuted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
