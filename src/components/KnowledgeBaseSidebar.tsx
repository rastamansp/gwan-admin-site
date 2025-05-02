import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import KnowledgeService, { KnowledgeBase } from '../services/knowledge.service';

const KnowledgeBaseSidebar: React.FC = () => {
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const location = useLocation();
    const knowledgeService = KnowledgeService.getInstance();

    useEffect(() => {
        loadKnowledgeBases();
    }, []);

    const loadKnowledgeBases = async () => {
        try {
            setLoading(true);
            const bases = await knowledgeService.listKnowledgeBases();
            setKnowledgeBases(bases);
        } catch (err) {
            console.error('Error loading knowledge bases:', err);
            setError('Error loading knowledge bases');
        } finally {
            setLoading(false);
        }
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    if (loading) {
        return (
            <div className="py-2">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return null;
    }

    return (
        <ul role="list" className="-mx-2 space-y-1 mt-2">
            {knowledgeBases.map((base) => (
                <li key={base._id}>
                    <Link
                        to={`/datasets/${base._id}/documents`}
                        className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium
                            ${isActive(`/datasets/${base._id}/documents`)
                                ? 'bg-gray-50 text-primary-600 dark:bg-gray-700 dark:text-primary-400'
                                : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400'
                            }
                        `}
                    >
                        <DocumentTextIcon
                            className="h-5 w-5 shrink-0"
                            aria-hidden="true"
                        />
                        <span className="truncate">{base.name}</span>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default KnowledgeBaseSidebar; 