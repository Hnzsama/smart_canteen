import { useState, type FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Edit2,
    FolderPlus,
    Layers,
    Loader2,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    destroy as destroyCategoryRoute,
    store as storeCategoryRoute,
    update as updateCategoryRoute,
} from '@/routes/tenant/categories';
import { TenantPageHeader } from './components/tenant-page-header';

type CategoryItem = {
    id: number;
    name: string;
    slug: string;
    menus_count: number;
    created_at: string;
};

type Props = {
    categories?: CategoryItem[];
    filters?: {
        search?: string;
    };
};

export default function TenantCategories({ categories = [], filters = { search: '' } }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createName, setCreateName] = useState('');
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);

    const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
    const [editName, setEditName] = useState('');
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

    const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            '/tenant/categories',
            { search: search.trim() },
            { preserveState: true, replace: true }
        );
    };

    const handleCreateCategory = (e: FormEvent) => {
        e.preventDefault();
        if (!createName.trim()) return;

        setIsSubmittingCreate(true);
        router.post(
            storeCategoryRoute().url,
            { name: createName.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsCreateOpen(false);
                    setCreateName('');
                },
                onFinish: () => {
                    setIsSubmittingCreate(false);
                },
            }
        );
    };

    const handleUpdateCategory = (e: FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editName.trim()) return;

        setIsSubmittingEdit(true);
        router.put(
            updateCategoryRoute({ category: editingCategory.id }).url,
            { name: editName.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingCategory(null);
                    setEditName('');
                },
                onFinish: () => {
                    setIsSubmittingEdit(false);
                },
            }
        );
    };

    const handleDeleteCategory = () => {
        if (!deletingCategory) return;

        setIsSubmittingDelete(true);
        router.delete(
            destroyCategoryRoute({ category: deletingCategory.id }).url,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setDeletingCategory(null);
                },
                onFinish: () => {
                    setIsSubmittingDelete(false);
                },
            }
        );
    };

    return (
        <>
            <Head title="Kelola Kategori Stand - Smart Canteen FEB" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8 w-full">
                <TenantPageHeader
                    icon={Layers}
                    iconVariant="violet"
                    title="Kelola Kategori Menu Stand"
                    description="Buat dan atur kelompok menu khusus untuk stand Anda."
                    actions={
                        <Button
                            onClick={() => setIsCreateOpen(true)}
                            size="sm"
                            className="h-8 gap-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Tambah Kategori</span>
                        </Button>
                    }
                />

                {/* Filter & Table Container */}
                <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-xs space-y-4">
                    <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-sm">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari nama kategori..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 text-xs"
                            />
                        </div>
                        <Button type="submit" variant="secondary" size="sm" className="h-9 text-xs">
                            Cari
                        </Button>
                    </form>

                    <div className="rounded-xl border border-border/60 overflow-hidden">
                        <ScrollArea className="w-full">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow>
                                        <TableHead className="w-16">No</TableHead>
                                        <TableHead>Nama Kategori</TableHead>
                                        <TableHead>Slug Identifier</TableHead>
                                        <TableHead className="text-center">Jumlah Menu</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-xs">
                                                Belum ada kategori menu. Klik tombol "+ Tambah Kategori" untuk menambahkan.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        categories.map((cat, idx) => (
                                            <TableRow key={cat.id}>
                                                <TableCell className="font-mono text-xs text-muted-foreground">
                                                    {idx + 1}
                                                </TableCell>
                                                <TableCell className="font-bold text-xs text-foreground">
                                                    {cat.name}
                                                </TableCell>
                                                <TableCell className="font-mono text-[11px] text-muted-foreground">
                                                    {cat.slug}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[11px] font-bold px-2 py-0.5 rounded-md">
                                                        {cat.menus_count} Menu
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setEditingCategory(cat);
                                                                setEditName(cat.name);
                                                            }}
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setDeletingCategory(cat)}
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <ScrollBar orientation="horizontal" className="h-1.5" />
                        </ScrollArea>
                    </div>
                </div>
            </div>

            {/* Modal Create Category */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleCreateCategory}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base">
                                <FolderPlus className="h-5 w-5 text-purple-500" />
                                <span>Tambah Kategori Stand Baru</span>
                            </DialogTitle>
                            <DialogDescription className="text-xs">
                                Masukkan nama kelompok kategori menu untuk stand Anda.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4 space-y-2">
                            <Label htmlFor="create-cat-name" className="text-xs font-semibold">
                                Nama Kategori <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="create-cat-name"
                                placeholder="Cth: Makanan Berat / Minuman Dingin"
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)}
                                required
                                className="h-10 text-xs sm:text-sm"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmittingCreate}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                            >
                                {isSubmittingCreate ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                                <span>Simpan Kategori</span>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit Category */}
            <Dialog open={Boolean(editingCategory)} onOpenChange={() => setEditingCategory(null)}>
                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleUpdateCategory}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-base">
                                <Edit2 className="h-5 w-5 text-blue-500" />
                                <span>Edit Kategori Stand</span>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="py-4 space-y-2">
                            <Label htmlFor="edit-cat-name" className="text-xs font-semibold">
                                Nama Kategori <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="edit-cat-name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                                className="h-10 text-xs sm:text-sm"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" size="sm" onClick={() => setEditingCategory(null)}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmittingEdit}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                            >
                                {isSubmittingEdit ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                                <span>Simpan Perubahan</span>
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Delete Category */}
            <Dialog open={Boolean(deletingCategory)} onOpenChange={() => setDeletingCategory(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base text-destructive">
                            <Trash2 className="h-5 w-5" />
                            <span>Hapus Kategori '{deletingCategory?.name}'?</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Menu yang menggunakan kategori ini akan tetap ada namun status kategorinya menjadi 'Tanpa Kategori'.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" size="sm" onClick={() => setDeletingCategory(null)}>
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={isSubmittingDelete}
                            onClick={handleDeleteCategory}
                            className="font-bold"
                        >
                            {isSubmittingDelete ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                            <span>Ya, Hapus Kategori</span>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

TenantCategories.layout = {
    breadcrumbs: [
        {
            title: 'Tenant Dashboard',
            href: '/tenant/dashboard',
        },
        {
            title: 'Kelola Kategori Stand',
            href: '/tenant/categories',
        },
    ],
};
